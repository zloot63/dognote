/**
 * 성능 모니터링 시스템
 * 
 * 이 모듈은 DogNote 애플리케이션의 성능을 모니터링하고
 * 메트릭을 수집하여 성능 최적화에 도움을 제공합니다.
 * 
 * 주요 기능:
 * - Core Web Vitals 측정 (FCP, LCP, CLS, FID)
 * - Firebase 성능 모니터링 연동
 * - 커스텀 성능 메트릭 추적
 * - 성능 경고 및 알림
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Core Web Vitals 임계값
   */
  private readonly THRESHOLDS = {
    FCP: { good: 1800, poor: 3000 },  // First Contentful Paint
    LCP: { good: 2500, poor: 4000 },  // Largest Contentful Paint
    CLS: { good: 0.1, poor: 0.25 },   // Cumulative Layout Shift
    FID: { good: 100, poor: 300 },    // First Input Delay
    INP: { good: 200, poor: 500 },    // Interaction to Next Paint
  } as const;

  /**
   * 성능 메트릭 등급 결정
   */
  private getRating(name: keyof typeof this.THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.THRESHOLDS[name];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * 성능 메트릭 기록
   */
  recordMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: name in this.THRESHOLDS 
        ? this.getRating(name as keyof typeof this.THRESHOLDS, value)
        : 'good',
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // 프로덕션 환경에서 성능 경고 로깅
    if (this.isProduction && metric.rating === 'poor') {
      console.warn(`🚨 Performance Warning: ${name} = ${value}ms (Poor)`);
      this.sendPerformanceAlert(metric);
    }

    // 개발 환경에서 디버그 로깅
    if (!this.isProduction) {
      console.log(`📊 Performance: ${name} = ${value}ms (${metric.rating})`);
    }
  }

  /**
   * Web Vitals 메트릭 처리
   */
  handleWebVitals(metric: WebVitalsMetric): void {
    this.recordMetric(metric.name, metric.value);
    
    // Firebase Performance Monitoring에 전송 (프로덕션)
    if (this.isProduction) {
      this.sendToFirebasePerformance(metric);
    }
  }

  /**
   * 커스텀 성능 측정 시작
   */
  startMeasure(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * 커스텀 성능 측정 종료
   */
  endMeasure(name: string): number | null {
    if (typeof window === 'undefined' || !window.performance) {
      return null;
    }

    try {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name, 'measure')[0];
      const duration = measure?.duration || 0;
      
      this.recordMetric(name, duration);
      
      // 측정 마크 정리
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
      
      return duration;
    } catch (error) {
      console.error('Performance measurement error:', error);
      return null;
    }
  }

  /**
   * 페이지 로드 성능 측정
   */
  measurePageLoad(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          // 주요 로드 메트릭 계산
          const ttfb = navigation.responseStart - navigation.requestStart;
          const domLoad = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          const pageLoad = navigation.loadEventEnd - navigation.loadEventStart;
          
          this.recordMetric('TTFB', ttfb);
          this.recordMetric('DOM-Load', domLoad);
          this.recordMetric('Page-Load', pageLoad);
        }

        // Paint 메트릭 측정
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          this.recordMetric(entry.name.toUpperCase(), entry.startTime);
        });
      }, 0);
    });
  }

  /**
   * 리소스 로딩 성능 모니터링
   */
  monitorResourceLoading(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // 큰 리소스나 느린 로딩 감지
          if (resourceEntry.transferSize > 500000) { // 500KB 이상
            console.warn(`🚨 Large Resource: ${resourceEntry.name} (${Math.round(resourceEntry.transferSize / 1024)}KB)`);
          }
          
          if (resourceEntry.duration > 2000) { // 2초 이상
            console.warn(`🚨 Slow Resource: ${resourceEntry.name} (${Math.round(resourceEntry.duration)}ms)`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Firebase Performance에 메트릭 전송 (프로덕션)
   */
  private sendToFirebasePerformance(metric: WebVitalsMetric): void {
    if (typeof window === 'undefined') return;

    try {
      // Firebase Performance SDK 사용 예시
      // 실제 구현에서는 Firebase Performance SDK를 import 해야 함
      if ((window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          custom_parameter_1: metric.navigationType,
        });
      }
    } catch (error) {
      console.error('Failed to send metric to Firebase:', error);
    }
  }

  /**
   * 성능 경고 전송
   */
  private sendPerformanceAlert(metric: PerformanceMetric): void {
    // 실제 구현에서는 알림 서비스(Slack, Discord, 이메일 등)에 전송
    if (this.isProduction) {
      fetch('/api/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          timestamp: metric.timestamp,
          userAgent: navigator.userAgent,
          url: window.location.href,
        })
      }).catch(error => {
        console.error('Failed to send performance alert:', error);
      });
    }
  }

  /**
   * 현재 메트릭 반환
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * 메트릭 초기화
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * 성능 리포트 생성
   */
  generateReport(): {
    summary: { good: number; needsImprovement: number; poor: number };
    metrics: PerformanceMetric[];
  } {
    const summary = this.metrics.reduce(
      (acc, metric) => {
        acc[metric.rating === 'needs-improvement' ? 'needsImprovement' : metric.rating]++;
        return acc;
      },
      { good: 0, needsImprovement: 0, poor: 0 }
    );

    return {
      summary,
      metrics: this.getMetrics(),
    };
  }
}

// 전역 성능 모니터 인스턴스
export const performanceMonitor = new PerformanceMonitor();

/**
 * Web Vitals 모니터링 초기화
 * 이 함수는 _app.tsx나 layout.tsx에서 호출해야 합니다.
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Core Web Vitals 측정 (web-vitals 라이브러리 사용)
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    onFCP(performanceMonitor.handleWebVitals.bind(performanceMonitor));
    onLCP(performanceMonitor.handleWebVitals.bind(performanceMonitor));
    onCLS(performanceMonitor.handleWebVitals.bind(performanceMonitor));
    onFID(performanceMonitor.handleWebVitals.bind(performanceMonitor));
    onTTFB(performanceMonitor.handleWebVitals.bind(performanceMonitor));
    onINP(performanceMonitor.handleWebVitals.bind(performanceMonitor));
  }).catch(error => {
    console.error('Failed to load web-vitals:', error);
  });

  // 페이지 로드 성능 측정
  performanceMonitor.measurePageLoad();
  
  // 리소스 로딩 모니터링
  performanceMonitor.monitorResourceLoading();
}

/**
 * 비동기 작업 성능 측정 유틸리티
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  performanceMonitor.startMeasure(name);
  try {
    const result = await fn();
    performanceMonitor.endMeasure(name);
    return result;
  } catch (error) {
    performanceMonitor.endMeasure(name);
    throw error;
  }
}

/**
 * 동기 작업 성능 측정 유틸리티
 */
export function measureSync<T>(name: string, fn: () => T): T {
  performanceMonitor.startMeasure(name);
  try {
    const result = fn();
    performanceMonitor.endMeasure(name);
    return result;
  } catch (error) {
    performanceMonitor.endMeasure(name);
    throw error;
  }
}

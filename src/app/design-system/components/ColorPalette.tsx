import React, { useState } from 'react';
import { theme } from '@/styles/theme';
import { ColorScale, ColorShade } from '@/lib/theme-utils';

interface ColorPaletteProps {
  className?: string;
}

/**
 * 디자인 시스템의 컬러 팔레트 컴포넌트
 * 모든 색상 스케일과 음영을 시각적으로 표시
 */
export function ColorPalette({ className = '' }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // 클립보드에 색상 코드 복사 함수
  const copyToClipboard = (text: string, colorKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorKey);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // 색상 스케일 목록
  const colorScales = Object.keys(theme.colors) as ColorScale[];
  
  // 음영 값 목록
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as ColorShade[];

  return (
    <div className={`space-y-8 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold mb-4">컬러 팔레트</h3>
        <p className="mb-4">
          DogNote 디자인 시스템은 일관된 색상 사용을 위한 컬러 팔레트를 제공합니다.
          각 색상은 50부터 950까지의 음영을 가지며, 다양한 상황에 맞게 사용할 수 있습니다.
        </p>
        
        <div className="space-y-8">
          {colorScales.map((scale) => (
            <div key={scale} className="space-y-2">
              <h4 className="font-medium capitalize">{scale}</h4>
              <div className="grid grid-cols-11 gap-2">
                {shades.map((shade) => {
                  const colorScale = theme.colors[scale];
                  const colorValue = colorScale?.[shade as keyof typeof colorScale];
                  if (!colorValue) return null;
                  
                  const colorKey = `${scale}-${shade}`;
                  const isCopied = copiedColor === colorKey;
                  
                  return (
                    <div key={shade} className="space-y-1">
                      <button
                        onClick={() => copyToClipboard(colorValue, colorKey)}
                        className="w-full h-12 rounded-md border border-neutral-200 flex items-center justify-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        style={{ backgroundColor: colorValue }}
                        title={`${colorValue} 복사하기`}
                      >
                        {isCopied && (
                          <span className="bg-white bg-opacity-90 text-xs px-1 py-0.5 rounded">
                            복사됨
                          </span>
                        )}
                      </button>
                      <div className="text-center">
                        <div className="text-xs font-mono">{shade}</div>
                        <div className="text-xs text-neutral-500 font-mono hidden sm:block">
                          {colorValue}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <h4 className="font-medium mb-2">색상 사용 가이드</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
            <li><strong>Primary</strong>: 주요 브랜드 색상, 중요 버튼, 강조 요소</li>
            <li><strong>Secondary</strong>: 보조 브랜드 색상, 보조 버튼, 보조 강조</li>
            <li><strong>Neutral</strong>: 텍스트, 배경, 구분선 등 중립적 요소</li>
            <li><strong>Success</strong>: 성공 메시지, 완료 상태, 긍정적 피드백</li>
            <li><strong>Warning</strong>: 경고 메시지, 주의 필요 상태</li>
            <li><strong>Error</strong>: 오류 메시지, 실패 상태, 부정적 피드백</li>
            <li><strong>Info</strong>: 정보 메시지, 안내 상태</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

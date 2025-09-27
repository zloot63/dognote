import React from 'react';
import {Button} from '@/components/ui/Button';

interface ButtonExamplesProps {
  className?: string;
}

/**
 * 버튼 컴포넌트 예제 모음
 * 다양한 변형과 상태를 보여줌
 */
export function ButtonExamples({className = ''}: ButtonExamplesProps) {
  // 버튼 변형 목록 (실제 지원되는 variant만)
  const variants = [
    'default',
    'secondary',
    'outline',
    'ghost',
    'destructive',
    'link'
  ] as const;

  return (
    <div className={`space-y-8 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold mb-4">버튼</h3>
        <p className="mb-4">
          버튼은 사용자 액션을 유도하는 인터랙티브 요소입니다.
          다양한 변형, 크기, 상태를 지원합니다.
        </p>

        {/* 버튼 변형 */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">변형 (Variants)</h4>
            <div className="flex flex-wrap gap-4">
              {variants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* 버튼 크기 */}
          <div>
            <h4 className="font-medium mb-3">크기 (Sizes)</h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">⚙</Button>
            </div>
          </div>

          {/* 버튼 상태 */}
          <div>
            <h4 className="font-medium mb-3">상태 (States)</h4>
            <div className="flex flex-wrap gap-4">
              <Button>기본 상태</Button>
              <Button disabled>비활성화</Button>
              <Button loading>로딩 중</Button>
            </div>
          </div>

          {/* 색상 클래스 테스트 */}
          <div>
            <h4 className="font-medium mb-3">색상 클래스 테스트</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Primary Colors</h5>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-primary-50 p-2 rounded text-xs">50</div>
                  <div className="bg-primary-100 p-2 rounded text-xs">100</div>
                  <div className="bg-primary-200 p-2 rounded text-xs">200</div>
                  <div className="bg-primary-300 p-2 rounded text-xs text-white">300</div>
                  <div className="bg-primary-400 p-2 rounded text-xs text-white">400</div>
                  <div className="bg-primary-500 p-2 rounded text-xs text-white">500</div>
                  <div className="bg-primary-600 p-2 rounded text-xs text-white">600</div>
                  <div className="bg-primary-700 p-2 rounded text-xs text-white">700</div>
                  <div className="bg-primary-800 p-2 rounded text-xs text-white">800</div>
                  <div className="bg-primary-900 p-2 rounded text-xs text-white">900</div>
                  <div className="bg-primary-950 p-2 rounded text-xs text-white">950</div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">Custom Primary Buttons</h5>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-primary-300 text-white px-4 py-2 rounded">300</button>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded">600</button>
                  <button className="bg-primary-700 text-white px-4 py-2 rounded">700</button>
                  <button className="bg-primary-800 text-white px-4 py-2 rounded">800</button>
                  <button className="bg-primary-900 text-white px-4 py-2 rounded">900</button>
                  <button className="bg-primary-950 text-white px-4 py-2 rounded">950</button>
                </div>
              </div>
            </div>
          </div>

          {/* 아이콘 버튼 */}
          <div>
            <h4 className="font-medium mb-3">아이콘 버튼</h4>
            <div className="flex flex-wrap gap-4">
              <Button>
                <span className="mr-2">👍</span> 좋아요
              </Button>
              <Button variant="outline">
                <span className="mr-2">📥</span> 다운로드
              </Button>
              <Button variant="ghost">
                <span className="mr-2">🔍</span> 검색
              </Button>
            </div>
          </div>
        </div>

        {/* 사용 가이드 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">사용 권장사항</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
              <li>Primary 변형은 페이지당 한 번만 사용 (주요 액션)</li>
              <li>Secondary 변형은 보조 액션에 사용</li>
              <li>Ghost/Outline 변형은 덜 중요한 액션에 사용</li>
              <li>버튼 텍스트는 동사 또는 동사구로 작성</li>
              <li>아이콘은 의미를 명확히 전달할 때만 사용</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">사용 주의사항</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
              <li>한 페이지에 너무 많은 Primary 버튼 사용 금지</li>
              <li>버튼 텍스트는 간결하게 유지 (2-3단어 이내)</li>
              <li>Destructive 변형은 삭제/취소 등 위험 작업에만 사용</li>
              <li>비활성화된 버튼에는 툴팁으로 이유 설명</li>
              <li>모바일에서는 터치 영역 충분히 확보 (최소 44px)</li>
            </ul>
          </div>
        </div>

        {/* 코드 예제 */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">사용 예제</h4>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <pre className="text-sm text-neutral-700 overflow-x-auto">
              <code>{`// 기본 버튼
<Button>기본 버튼</Button>

// 변형 지정
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// 크기 지정
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// 상태 지정
<Button disabled>비활성화</Button>
<Button loading>로딩 중</Button>

// 아이콘 버튼
<Button>
  <span className="mr-2">👍</span> 좋아요
</Button>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

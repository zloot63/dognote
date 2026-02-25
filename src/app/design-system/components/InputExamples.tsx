import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface InputExamplesProps {
  className?: string;
}

/**
 * 입력 필드 컴포넌트 예제 모음
 * 다양한 변형과 상태를 보여줌
 */
export function InputExamples({ className = '' }: InputExamplesProps) {
  const [inputValues, setInputValues] = useState({
    default: '',
    filled: '',
    underlined: '',
    error: '',
    disabled: '',
    withIcon: '',
    withLabel: '',
  });

  const handleChange = (field: string, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold mb-4">입력 필드</h3>
        <p className="mb-4">
          입력 필드는 사용자로부터 데이터를 수집하는 인터랙티브 요소입니다.
          다양한 변형, 상태, 유효성 검사를 지원합니다.
        </p>

        {/* 입력 필드 변형 */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">변형 (Variants)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-input">기본 스타일</Label>
                <Input
                  id="default-input"
                  placeholder="기본 입력 필드"
                  value={inputValues.default}
                  onChange={e => handleChange('default', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filled-input">채워진 스타일</Label>
                <Input
                  id="filled-input"
                  className="bg-neutral-100 border-0 focus:bg-white focus:ring-4 focus:ring-primary-100"
                  placeholder="채워진 입력 필드"
                  value={inputValues.filled}
                  onChange={e => handleChange('filled', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="underlined-input">밑줄 스타일</Label>
                <Input
                  id="underlined-input"
                  className="border-0 border-b-2 border-neutral-200 bg-transparent rounded-none focus:border-primary-500 focus:ring-0"
                  placeholder="밑줄 입력 필드"
                  value={inputValues.underlined}
                  onChange={e => handleChange('underlined', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-input">오류 상태</Label>
                <Input
                  id="error-input"
                  className="border-2 border-error-300 focus:border-error-500 focus:ring-4 focus:ring-error-100"
                  placeholder="오류 입력 필드"
                  value={inputValues.error}
                  onChange={e => handleChange('error', e.target.value)}
                />
                <p className="text-error-600 text-sm">이 필드는 필수입니다.</p>
              </div>
            </div>
          </div>

          {/* 입력 필드 상태 */}
          <div>
            <h4 className="font-medium mb-3">상태 (States)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="disabled-input">비활성화 상태</Label>
                <Input
                  id="disabled-input"
                  placeholder="비활성화된 입력 필드"
                  disabled
                  value={inputValues.disabled}
                  onChange={e => handleChange('disabled', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="readonly-input">읽기 전용 상태</Label>
                <Input
                  id="readonly-input"
                  placeholder="읽기 전용 입력 필드"
                  readOnly
                  value="읽기 전용 텍스트"
                />
              </div>
            </div>
          </div>

          {/* 아이콘 입력 필드 */}
          <div>
            <h4 className="font-medium mb-3">아이콘 입력 필드</h4>
            <div className="space-y-2">
              <Label htmlFor="icon-input">검색</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                  🔍
                </span>
                <Input
                  id="icon-input"
                  placeholder="검색어 입력..."
                  className="pl-10"
                  value={inputValues.withIcon}
                  onChange={e => handleChange('withIcon', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 입력 필드 크기 */}
          <div>
            <h4 className="font-medium mb-3">크기 (Sizes)</h4>
            <div className="space-y-4">
              <Input
                className="h-8 text-xs px-2 py-1"
                placeholder="작은 크기 (Small)"
              />
              <Input placeholder="중간 크기 (Medium)" />
              <Input
                className="h-12 text-lg px-4 py-3"
                placeholder="큰 크기 (Large)"
              />
            </div>
          </div>
        </div>

        {/* 사용 가이드 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">사용 권장사항</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
              <li>항상 레이블과 함께 사용하여 접근성 향상</li>
              <li>명확한 placeholder 텍스트 제공</li>
              <li>필수 필드는 시각적으로 표시 (예: * 기호)</li>
              <li>오류 메시지는 구체적이고 도움이 되도록 작성</li>
              <li>입력 형식이 필요한 경우 예시 제공</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2">사용 주의사항</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
              <li>placeholder를 레이블 대체용으로 사용하지 않기</li>
              <li>너무 많은 입력 필드를 한 번에 표시하지 않기</li>
              <li>오류 메시지는 부정적이거나 비난하는 톤 피하기</li>
              <li>입력 중 실시간 유효성 검사는 신중하게 사용</li>
              <li>자동 포커스는 접근성 문제를 일으킬 수 있음</li>
            </ul>
          </div>
        </div>

        {/* 코드 예제 */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">사용 예제</h4>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <pre className="text-sm text-neutral-700 overflow-x-auto">
              <code>{`// 기본 입력 필드
<Label htmlFor="email">이메일</Label>
<Input id="email" placeholder="이메일 입력..." />

// 변형 지정 (className 사용)
<Input placeholder="기본 스타일" />
<Input className="bg-neutral-100 border-0 focus:bg-white" placeholder="채워진 스타일" />
<Input className="border-0 border-b-2 border-neutral-200 rounded-none" placeholder="밑줄 스타일" />
<Input className="border-2 border-error-300 focus:border-error-500" placeholder="오류 상태" />

// 상태 지정
<Input disabled placeholder="비활성화 상태" />
<Input readOnly value="읽기 전용 상태" />

// 크기 지정 (className 사용)
<Input className="h-8 text-xs px-2 py-1" placeholder="작은 크기" />
<Input placeholder="중간 크기" />
<Input className="h-12 text-lg px-4 py-3" placeholder="큰 크기" />

// 아이콘 입력 필드
<div className="relative">
  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
  <Input placeholder="검색어 입력..." className="pl-10" />
</div>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

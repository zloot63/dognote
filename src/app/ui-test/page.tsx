'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  TextArea,
  Modal,
  Spinner,
  Loading,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  Toast,
  useToast,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
} from '@/components/ui';

export default function UITestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const { toasts, toast, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">UI 컴포넌트 테스트</h1>
          <p className="mt-2 text-muted-foreground">
            DogNote 프로젝트의 기본 UI 컴포넌트들을 테스트합니다.
          </p>
        </div>

        {/* Button 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Button 컴포넌트</CardTitle>
            <CardDescription>다양한 버튼 스타일과 크기를 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Input 컴포넌트</CardTitle>
            <CardDescription>다양한 입력 필드를 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="기본 입력"
                placeholder="텍스트를 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="이메일"
                type="email"
                placeholder="email@example.com"
                helperText="올바른 이메일 형식으로 입력해주세요"
              />
              <Input
                label="오류 상태"
                placeholder="오류가 있는 입력"
                error="이 필드는 필수입니다"
              />
              <Input
                label="아이콘 포함"
                placeholder="검색..."
                leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* TextArea 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>TextArea 컴포넌트</CardTitle>
            <CardDescription>텍스트 영역 컴포넌트를 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TextArea
                label="메모"
                placeholder="여러 줄의 텍스트를 입력하세요..."
                value={textAreaValue}
                onChange={(e) => setTextAreaValue(e.target.value)}
                helperText="최대 500자까지 입력 가능합니다"
              />
              <TextArea
                label="고정 크기"
                placeholder="크기 조절이 불가능한 텍스트 영역"
                resize="none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Modal 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Modal 컴포넌트</CardTitle>
            <CardDescription>모달 다이얼로그를 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>
              모달 열기
            </Button>
          </CardContent>
        </Card>

        {/* Loading 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Loading 컴포넌트</CardTitle>
            <CardDescription>로딩 스피너와 스켈레톤을 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium">Spinner</h4>
                <div className="flex items-center gap-4">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium">Loading with Text</h4>
                <Loading text="데이터를 불러오는 중..." />
              </div>
              
              <div>
                <h4 className="mb-2 font-medium">Skeleton</h4>
                <div className="space-y-4">
                  <Skeleton variant="text" lines={3} />
                  <div className="flex items-center space-x-3">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1">
                      <Skeleton variant="text" />
                      <Skeleton variant="text" width="60%" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium">Card Skeleton</h4>
                <CardSkeleton />
              </div>
              
              <div>
                <h4 className="mb-2 font-medium">List Skeleton</h4>
                <ListSkeleton items={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toast 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>Toast 컴포넌트</CardTitle>
            <CardDescription>토스트 알림을 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toast.success('성공!', '작업이 성공적으로 완료되었습니다.')}>
                Success Toast
              </Button>
              <Button onClick={() => toast.error('오류!', '문제가 발생했습니다.')}>
                Error Toast
              </Button>
              <Button onClick={() => toast.warning('경고!', '주의가 필요합니다.')}>
                Warning Toast
              </Button>
              <Button onClick={() => toast.info('정보', '새로운 정보가 있습니다.')}>
                Info Toast
              </Button>
              <Button onClick={() => toast.default('기본', '기본 토스트 메시지입니다.')}>
                Default Toast
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 컴포넌트 테스트 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card variant="default">
            <CardHeader>
              <CardTitle>기본 카드</CardTitle>
              <CardDescription>기본 스타일의 카드입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>카드 내용이 여기에 표시됩니다.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">액션</Button>
            </CardFooter>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>아웃라인 카드</CardTitle>
              <CardDescription>테두리가 강조된 카드입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>아웃라인 스타일의 카드 내용입니다.</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>엘리베이티드 카드</CardTitle>
              <CardDescription>그림자가 있는 카드입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>그림자 효과가 적용된 카드입니다.</p>
            </CardContent>
          </Card>

          <Card variant="filled">
            <CardHeader>
              <CardTitle>채워진 카드</CardTitle>
              <CardDescription>배경색이 있는 카드입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>배경색이 적용된 카드입니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="테스트 모달"
        description="이것은 테스트용 모달입니다."
        size="md"
      >
        <div className="space-y-4">
          <p>모달 내용이 여기에 표시됩니다.</p>
          <Input placeholder="모달 내 입력 필드" />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]">
          {toasts.map((toastItem) => (
            <Toast
              key={toastItem.id}
              {...toastItem}
              onClose={() => removeToast(toastItem.id!)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

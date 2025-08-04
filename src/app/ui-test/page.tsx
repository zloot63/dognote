'use client';

import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  IconButton,
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
} from '@/components/ui';
import { 
  Search, 
  Heart, 
  Star, 
  Download, 
  Settings, 
  User,
  Mail,
  Lock,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

export default function UITestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [loadingStates, setLoadingStates] = useState({
    button1: false,
    button2: false,
    input: false
  });
  const { toasts, toast, removeToast } = useToast();

  const handleLoadingTest = (key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
      toast.success('성공!', `${key} 로딩이 완료되었습니다.`);
    }, 2000);
  };

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
            <CardTitle>🔘 Button 컴포넌트</CardTitle>
            <CardDescription>개선된 버튼 스타일과 다양한 기능을 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 기본 변형 */}
              <div>
                <h4 className="font-medium mb-3">버튼 변형</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                </div>
              </div>

              {/* 크기 */}
              <div>
                <h4 className="font-medium mb-3">버튼 크기</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* 아이콘 버튼 */}
              <div>
                <h4 className="font-medium mb-3">아이콘 버튼</h4>
                <div className="flex flex-wrap gap-2">
                  <Button leftIcon={<Heart className="h-4 w-4" />}>좋아요</Button>
                  <Button rightIcon={<Download className="h-4 w-4" />} variant="outline">다운로드</Button>
                  <Button 
                    leftIcon={<Save className="h-4 w-4" />} 
                    rightIcon={<Plus className="h-4 w-4" />}
                    variant="success"
                  >
                    저장하고 추가
                  </Button>
                </div>
              </div>

              {/* 로딩 상태 */}
              <div>
                <h4 className="font-medium mb-3">로딩 상태</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    loading={loadingStates.button1}
                    onClick={() => handleLoadingTest('button1')}
                  >
                    로딩 테스트 1
                  </Button>
                  <Button 
                    variant="outline"
                    loading={loadingStates.button2}
                    onClick={() => handleLoadingTest('button2')}
                  >
                    로딩 테스트 2
                  </Button>
                </div>
              </div>

              {/* 아이콘 전용 버튼 */}
              <div>
                <h4 className="font-medium mb-3">아이콘 전용 버튼</h4>
                <div className="flex flex-wrap gap-2">
                  <IconButton icon={<Settings />} aria-label="설정" />
                  <IconButton icon={<Edit />} aria-label="편집" variant="outline" />
                  <IconButton icon={<Trash2 />} aria-label="삭제" variant="destructive" />
                  <IconButton icon={<Star />} aria-label="즐겨찾기" variant="warning" size="lg" />
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div>
                <h4 className="font-medium mb-3">버튼 그룹</h4>
                <div className="space-y-3">
                  <ButtonGroup>
                    <Button variant="outline">왼쪽</Button>
                    <Button variant="outline">가운데</Button>
                    <Button variant="outline">오른쪽</Button>
                  </ButtonGroup>
                  
                  <ButtonGroup orientation="vertical" spacing="md">
                    <Button variant="primary">위</Button>
                    <Button variant="primary">가운데</Button>
                    <Button variant="primary">아래</Button>
                  </ButtonGroup>
                </div>
              </div>

              {/* 특수 스타일 */}
              <div>
                <h4 className="font-medium mb-3">특수 스타일</h4>
                <div className="space-y-2">
                  <Button fullWidth>전체 너비 버튼</Button>
                  <div className="flex gap-2">
                    <Button rounded="none">각진 모서리</Button>
                    <Button rounded="full">완전 둥근 모서리</Button>
                    <Button shadow="lg">큰 그림자</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input 컴포넌트 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Input 컴포넌트</CardTitle>
            <CardDescription>개선된 입력 필드와 다양한 기능을 테스트합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 기본 입력 */}
              <div>
                <h4 className="font-medium mb-3">기본 입력 필드</h4>
                <div className="space-y-4">
                  <Input
                    label="기본 입력"
                    placeholder="텍스트를 입력하세요"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    clearable
                    onClear={() => setInputValue('')}
                  />
                  <Input
                    label="필수 입력 *"
                    placeholder="필수 입력 필드"
                    required
                    error={!inputValue ? "필수 입력 항목입니다" : ""}
                  />
                  <Input
                    label="도움말 텍스트"
                    placeholder="도움말 테스트"
                    helperText="이것은 도움말 텍스트입니다. 입력 방법을 안내합니다."
                  />
                </div>
              </div>

              {/* 변형 스타일 */}
              <div>
                <h4 className="font-medium mb-3">입력 필드 변형</h4>
                <div className="space-y-4">
                  <Input
                    label="기본 스타일"
                    placeholder="기본 테두리 스타일"
                    variant="default"
                  />
                  <Input
                    label="채워진 스타일"
                    placeholder="배경이 채워진 스타일"
                    variant="filled"
                  />
                  <Input
                    label="밑줄 스타일"
                    placeholder="밑줄만 있는 스타일"
                    variant="underlined"
                  />
                </div>
              </div>

              {/* 크기 */}
              <div>
                <h4 className="font-medium mb-3">입력 필드 크기</h4>
                <div className="space-y-4">
                  <Input label="작은 크기" placeholder="Small size" inputSize="sm" />
                  <Input label="중간 크기" placeholder="Medium size" inputSize="md" />
                  <Input label="큰 크기" placeholder="Large size" inputSize="lg" />
                </div>
              </div>

              {/* 아이콘 */}
              <div>
                <h4 className="font-medium mb-3">아이콘이 있는 입력 필드</h4>
                <div className="space-y-4">
                  <Input
                    label="검색"
                    placeholder="검색어를 입력하세요"
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                  <Input
                    label="이메일"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    leftIcon={<Mail className="h-4 w-4" />}
                    rightIcon={<User className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* 패스워드 */}
              <div>
                <h4 className="font-medium mb-3">패스워드 입력</h4>
                <Input
                  label="패스워드"
                  type="password"
                  placeholder="패스워드를 입력하세요"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  helperText="8자 이상, 영문/숫자/특수문자 포함"
                />
              </div>

              {/* 로딩 상태 */}
              <div>
                <h4 className="font-medium mb-3">로딩 상태</h4>
                <Input
                  label="로딩 중"
                  placeholder="로딩 중입니다..."
                  loading={loadingStates.input}
                  leftIcon={<Search className="h-4 w-4" />}
                />
                <Button 
                  className="mt-2"
                  size="sm"
                  onClick={() => handleLoadingTest('input')}
                >
                  로딩 테스트
                </Button>
              </div>

              {/* TextArea */}
              <div>
                <h4 className="font-medium mb-3">텍스트 영역</h4>
                <div className="space-y-4">
                  <TextArea
                    label="기본 텍스트 영역"
                    placeholder="여러 줄의 텍스트를 입력하세요"
                    value={textAreaValue}
                    onChange={(e) => setTextAreaValue(e.target.value)}
                    helperText="최대 500자까지 입력 가능합니다"
                  />
                  <TextArea
                    label="크기 조절 비활성화"
                    placeholder="크기 조절이 비활성화된 텍스트 영역"
                    resize="none"
                  />
                  <TextArea
                    label="에러 상태"
                    placeholder="에러가 있는 텍스트 영역"
                    error="내용이 너무 짧습니다. 최소 10자 이상 입력해주세요."
                    required
                  />
                </div>
              </div>  
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

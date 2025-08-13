'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Checkbox from '@/components/ui/Checkbox';
import Radio from '@/components/ui/Radio';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Progress from '@/components/ui/Progress';
import { Spinner, Loading, Skeleton } from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import Tooltip from '@/components/ui/Tooltip';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Container from '@/components/ui/Container';
import Grid from '@/components/ui/Grid';
import Divider from '@/components/ui/Divider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import {
  Home,
  Settings,
  Search,
  Edit,
  CheckCircle,
  Filter,
  Eye,
  Heart,
  Download,
  Lock,
  Plus,
  Trash2
} from 'lucide-react';

// Toast 훅 모킹 (실제 구현이 없는 경우)
const useToast = () => {
  const [toasts, setToasts] = useState<any[]>([]);
  
  const addToast = (type: string, title: string, description?: string) => {
    const id = Date.now().toString();
    const newToast = { id, type, title, description };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => removeToast(id), 5000);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return {
    toasts,
    removeToast,
    toast: {
      success: (title: string, description?: string) => addToast('success', title, description),
      error: (title: string, description?: string) => addToast('error', title, description),
      warning: (title: string, description?: string) => addToast('warning', title, description),
      info: (title: string, description?: string) => addToast('info', title, description),
      default: (title: string, description?: string) => addToast('default', title, description)
    }
  };
};

export default function UITestPage() {
  // 상태 관리
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('option1');
  const [selectValue, setSelectValue] = useState('');
  const [progressValue] = useState(65);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast, toasts, removeToast } = useToast();

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // 브레드크럼 아이템
  const breadcrumbItems = [
    { label: '홈', href: '/', icon: <Home className="h-4 w-4" /> },
    { label: 'UI 테스트', href: '/ui-test' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Container size="xl" padding="lg">
        {/* 헤더 */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-4xl font-bold text-neutral-900 mt-4 mb-2">
            UI 컴포넌트 테스트
          </h1>
          <p className="text-lg text-neutral-600">
            DogNote 프로젝트의 모든 UI 컴포넌트를 테스트하고 확인할 수 있는 페이지입니다.
          </p>
        </div>

        <div className="space-y-8">
          {/* 기본 컴포넌트 섹션 */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary-600" />
                기본 컴포넌트
              </CardTitle>
              <CardDescription>
                가장 기본적인 UI 컴포넌트들을 테스트합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 버튼 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">버튼</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button>기본 버튼</Button>
                    <Button variant="outline">아웃라인</Button>
                    <Button variant="ghost">고스트</Button>
                    <Button variant="destructive">삭제</Button>
                    <Button size="sm">작은 버튼</Button>
                    <Button size="lg">큰 버튼</Button>
                    <Button disabled>비활성화</Button>
                    <Button loading={isLoading} onClick={handleLoadingDemo}>
                      로딩 테스트
                    </Button>
                  </div>
                </div>

                {/* 아이콘 버튼 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">아이콘 버튼</h4>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      좋아요
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      편집
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 입력 컴포넌트 섹션 */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary-600" />
                입력 컴포넌트
              </CardTitle>
              <CardDescription>
                사용자 입력을 받는 다양한 컴포넌트들을 테스트합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 입력 필드 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">입력 필드</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="기본 입력 필드"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="비밀번호"
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <Input
                      placeholder="검색..."
                      icon={<Search className="h-4 w-4" />}
                      variant="search"
                    />
                    <Input
                      placeholder="오류 상태"
                      variant="error"
                      error="필수 입력 항목입니다"
                    />
                  </div>
                </div>

                {/* 텍스트 영역 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">텍스트 영역</h4>
                  <TextArea
                    placeholder="여러 줄 텍스트를 입력하세요..."
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* 체크박스 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">체크박스</h4>
                  <div className="space-y-3">
                    <Checkbox
                      checked={isChecked}
                      onChange={setIsChecked}
                      label="기본 체크박스"
                    />
                    <Checkbox
                      checked={true}
                      onChange={() => {}}
                      label="선택된 체크박스"
                    />
                    <Checkbox
                      checked={false}
                      onChange={() => {}}
                      disabled
                      label="비활성화된 체크박스"
                    />
                  </div>
                </div>

                {/* 라디오 버튼 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">라디오 버튼</h4>
                  <div className="space-y-3">
                    <Radio
                      name="radio-group"
                      value="option1"
                      checked={selectedRadio === 'option1'}
                      onChange={setSelectedRadio}
                      label="옵션 1"
                    />
                    <Radio
                      name="radio-group"
                      value="option2"
                      checked={selectedRadio === 'option2'}
                      onChange={setSelectedRadio}
                      label="옵션 2"
                    />
                    <Radio
                      name="radio-group"
                      value="option3"
                      checked={selectedRadio === 'option3'}
                      onChange={setSelectedRadio}
                      label="옵션 3"
                    />
                  </div>
                </div>

                {/* 셀렉트 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">셀렉트</h4>
                  <Select
                    value={selectValue}
                    onChange={setSelectValue}
                    placeholder="옵션을 선택하세요"
                    options={[
                      { value: 'option1', label: '옵션 1' },
                      { value: 'option2', label: '옵션 2' },
                      { value: 'option3', label: '옵션 3' }
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 표시 컴포넌트 섹션 */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary-600" />
                표시 컴포넌트
              </CardTitle>
              <CardDescription>
                정보를 표시하는 다양한 컴포넌트들을 테스트합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 배지 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">배지</h4>
                  <div className="flex flex-wrap gap-3">
                    <Badge>기본</Badge>
                    <Badge variant="secondary">보조</Badge>
                    <Badge variant="success">성공</Badge>
                    <Badge variant="warning">경고</Badge>
                    <Badge variant="destructive">오류</Badge>
                    <Badge variant="outline">아웃라인</Badge>
                  </div>
                </div>

                {/* 아바타 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">아바타</h4>
                  <div className="flex items-center gap-4">
                    <Avatar size="sm" />
                    <Avatar size="md" />
                    <Avatar size="lg" />
                    <Avatar size="xl" />
                    <Avatar 
                      size="md" 
                      src=""
                      alt="강아지"
                    />
                  </div>
                </div>

                {/* 프로그레스 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">프로그레스</h4>
                  <div className="space-y-4">
                    <Progress value={progressValue} />
                    <Progress value={25} variant="success" />
                    <Progress value={75} variant="warning" />
                    <Progress value={90} variant="destructive" />
                  </div>
                </div>

                {/* 로딩 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">로딩</h4>
                  <div className="flex items-center gap-6">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                    <Loading text="데이터를 불러오는 중..." />
                  </div>
                </div>

                {/* 스켈레톤 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">스켈레톤</h4>
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
              </div>
            </CardContent>
          </Card>

          {/* 피드백 컴포넌트 섹션 */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                피드백 컴포넌트
              </CardTitle>
              <CardDescription>
                사용자에게 피드백을 제공하는 컴포넌트들을 테스트합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 모달 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">모달</h4>
                  <Button onClick={() => setIsModalOpen(true)}>
                    모달 열기
                  </Button>
                </div>

                {/* 토스트 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">토스트 알림</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" onClick={() => toast.success('성공!', '작업이 성공적으로 완료되었습니다.')}>
                      성공 토스트
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => toast.error('오류!', '문제가 발생했습니다.')}>
                      오류 토스트
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.warning('경고!', '주의가 필요합니다.')}>
                      경고 토스트
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info('정보', '새로운 정보가 있습니다.')}>
                      정보 토스트
                    </Button>
                  </div>
                </div>

                {/* 톨팁 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">톨팁</h4>
                  <div className="flex gap-3">
                    <Tooltip content="이것은 톨팁 메시지입니다">
                      <Button variant="outline">톨팁 테스트</Button>
                    </Tooltip>
                    <Tooltip content="위쪽에 표시되는 톨팁" position="top">
                      <Button variant="outline">위쪽 톨팁</Button>
                    </Tooltip>
                    <Tooltip content="오른쪽에 표시되는 톨팁" position="right">
                      <Button variant="outline">오른쪽 톨팁</Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 레이아웃 컴포넌트 섹션 */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary-600" />
                레이아웃 컴포넌트
              </CardTitle>
              <CardDescription>
                레이아웃과 구조를 위한 컴포넌트들을 테스트합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 컨테이너 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">컨테이너</h4>
                  <Container size="md" padding="sm" className="bg-neutral-100 border border-neutral-200">
                    <p className="text-center text-neutral-700">중간 크기의 컨테이너</p>
                  </Container>
                </div>

                {/* 그리드 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">그리드</h4>
                  <Grid cols={3} gap="md">
                    <div className="bg-primary-100 p-4 rounded-lg text-center">그리드 1</div>
                    <div className="bg-primary-100 p-4 rounded-lg text-center">그리드 2</div>
                    <div className="bg-primary-100 p-4 rounded-lg text-center">그리드 3</div>
                  </Grid>
                </div>

                {/* 구분선 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">구분선</h4>
                  <div className="space-y-4">
                    <p>위 내용</p>
                    <Divider />
                    <p>아래 내용</p>
                    <Divider variant="dashed" />
                    <p>점선 구분선 아래 내용</p>
                  </div>
                </div>

                {/* 카드 변형 */}
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-3">카드 변형</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card variant="default">
                      <CardHeader>
                        <CardTitle>기본 카드</CardTitle>
                        <CardDescription>기본 스타일의 카드입니다.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>카드 내용이 여기에 표시됩니다.</p>
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

                    <Card variant="interactive">
                      <CardHeader>
                        <CardTitle>인터랙티브 카드</CardTitle>
                        <CardDescription>클릭 가능한 카드입니다.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>마우스 호버 효과가 있는 카드입니다.</p>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>

      {/* 모달 */}
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

      {/* 토스트 컨테이너 */}
      {toasts.length > 0 && (
        <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]">
          {toasts.map((toastItem) => (
            <Toast
              key={toastItem.id}
              {...toastItem}
              onClose={() => removeToast(toastItem.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

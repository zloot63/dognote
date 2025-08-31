'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dog, DogFormData } from '@/types/dog';
import { useDogs, useCreateDog, useUpdateDog, useDeleteDog } from '@/hooks/useDogs';
import DogList from '@/components/dog/DogList';
import DogForm from '@/components/dog/DogForm';
import DogCard from '@/components/dog/DogCard';
import {
  Modal,
  Button,
  Container,
  Loading
} from '@/components/ui';

type ViewMode = 'list' | 'form' | 'detail';

const DogsPage: React.FC = () => {
  const { status } = useSession();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // React Query 훅들
  useDogs(); // 데이터는 스토어에 저장되기 때문에 직접 사용하지 않음
  const createDogMutation = useCreateDog();
  const updateDogMutation = useUpdateDog();
  const deleteDogMutation = useDeleteDog();

  // 로딩 상태
  if (status === 'loading') {
    return (
      <Container className="py-12">
        <div className="flex justify-center">
          <Loading size="lg" text="인증 확인 중..." />
        </div>
      </Container>
    );
  }

  // 로그인하지 않은 경우
  if (status === 'unauthenticated') {
    return (
      <Container className="py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-muted-foreground mb-6">
            강아지 프로필을 관리하려면 먼저 로그인해주세요.
          </p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            로그인하기
          </Button>
        </div>
      </Container>
    );
  }

  // 이벤트 핸들러들
  const handleAddNew = () => {
    setSelectedDog(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (dog: Dog) => {
    setSelectedDog(dog);
    setIsFormModalOpen(true);
  };

  const handleView = (dog: Dog) => {
    setSelectedDog(dog);
    setViewMode('detail');
  };

  const handleDelete = async (dog: Dog) => {
    if (window.confirm(`정말로 ${dog.name}을(를) 삭제하시겠습니까?`)) {
      try {
        await deleteDogMutation.mutateAsync(dog.id);
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const handleFormSubmit = async (formData: DogFormData) => {
    try {
      if (selectedDog) {
        // 수정
        await updateDogMutation.mutateAsync({
          dogId: selectedDog.id,
          dogData: formData
        });
      } else {
        // 등록
        await createDogMutation.mutateAsync(formData);
      }
      setIsFormModalOpen(false);
      setSelectedDog(null);
    } catch (error) {
      console.error('폼 제출 실패:', error);
    }
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setSelectedDog(null);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDog(null);
  };

  // 상세 보기 모드
  if (viewMode === 'detail' && selectedDog) {
    return (
      <Container className="py-6">
        <div className="mb-6">
          <Button variant="outline" onClick={handleBackToList}>
            ← 목록으로 돌아가기
          </Button>
        </div>
        
        <div className="flex justify-center">
          <DogCard
            dog={selectedDog}
            variant="detailed"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Container>
    );
  }

  // 목록 보기 모드 (기본)
  return (
    <>
      <DogList
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* 폼 모달 */}
      <Modal
        open={isFormModalOpen}
        onClose={handleFormCancel}
        title={selectedDog ? '강아지 정보 수정' : '새 강아지 등록'}
      >
        <DogForm
          dog={selectedDog || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={createDogMutation.isPending || updateDogMutation.isPending}
        />
      </Modal>

    </>
  );
};

export default DogsPage;

'use client';

import React, { useState } from 'react';
import { Dog, DogFormData } from '@/types/dog';
import DogForm from '@/components/dog/DogForm';
import DogCard from '@/components/dog/DogCard';
import DogList from '@/components/dog/DogList';
import {
  Container,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button
} from '@/components/ui';

// 테스트용 더미 데이터
const mockDogs: Dog[] = [
  {
    id: '1',
    userId: 'test-user',
    name: '멍멍이',
    breed: '골든 리트리버',
    gender: 'male',
    birthDate: '2020-05-15',
    weight: 25.5,
    profileImage: undefined,
    description: '활발하고 친근한 성격의 골든 리트리버입니다.',
    isNeutered: true,
    microchipId: 'MC123456789',
    registrationNumber: 'REG001',
    color: '황금색',
    size: 'large',
    activityLevel: 'high',
    temperament: ['활발한', '친화적인', '충성스러운'],
    allergies: [],
    medicalConditions: [],
    emergencyContact: {
      name: '김철수',
      phone: '010-1234-5678',
      relationship: '가족'
    },
    veterinarian: {
      name: '이수의사',
      clinic: '행복동물병원',
      phone: '02-123-4567',
      address: '서울시 강남구 테헤란로 123'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: 'test-user',
    name: '코코',
    breed: '포메라니안',
    gender: 'female',
    birthDate: '2022-03-20',
    weight: 3.2,
    profileImage: undefined,
    description: '작고 귀여운 포메라니안입니다.',
    isNeutered: false,
    color: '흰색',
    size: 'small',
    activityLevel: 'moderate',
    temperament: ['온순한', '장난기 많은'],
    allergies: ['닭고기'],
    medicalConditions: [],
    emergencyContact: {
      name: '박영희',
      phone: '010-9876-5432',
      relationship: '친구'
    },
    veterinarian: {
      name: '김수의사',
      clinic: '사랑동물병원',
      phone: '02-987-6543',
      address: '서울시 서초구 서초대로 456'
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
];

const DogTestPage: React.FC = () => {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const handleFormSubmit = async (data: DogFormData) => {
    console.log('폼 제출:', data);
    alert('폼 제출 완료! (콘솔 확인)');
  };

  const handleFormCancel = () => {
    setSelectedDog(null);
    setFormMode('create');
  };

  const handleEdit = (dog: Dog) => {
    setSelectedDog(dog);
    setFormMode('edit');
  };

  const handleView = (dog: Dog) => {
    console.log('강아지 보기:', dog);
  };

  const handleDelete = (dog: Dog) => {
    if (window.confirm(`${dog.name}을(를) 삭제하시겠습니까?`)) {
      console.log('강아지 삭제:', dog);
      alert('삭제 완료! (실제로는 삭제되지 않음)');
    }
  };

  const handleAddNew = () => {
    setSelectedDog(null);
    setFormMode('create');
  };

  return (
    <Container className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">강아지 컴포넌트 테스트</h1>
        <p className="text-muted-foreground">
          반려견 프로필 관리 컴포넌트들을 개별적으로 테스트할 수 있습니다.
        </p>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cards">카드 컴포넌트</TabsTrigger>
          <TabsTrigger value="list">목록 컴포넌트</TabsTrigger>
          <TabsTrigger value="form">폼 컴포넌트</TabsTrigger>
          <TabsTrigger value="integration">통합 테스트</TabsTrigger>
        </TabsList>

        {/* 카드 컴포넌트 테스트 */}
        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>DogCard 컴포넌트 테스트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">기본 카드 (그리드용)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockDogs.map((dog) => (
                      <DogCard
                        key={dog.id}
                        dog={dog}
                        variant="default"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">컴팩트 카드 (리스트용)</h3>
                  <div className="space-y-4">
                    {mockDogs.map((dog) => (
                      <DogCard
                        key={dog.id}
                        dog={dog}
                        variant="compact"
                        onEdit={handleEdit}
                        onView={handleView}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">상세 카드</h3>
                  <div className="flex justify-center">
                    <DogCard
                      dog={mockDogs[0]}
                      variant="detailed"
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 목록 컴포넌트 테스트 */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>DogList 컴포넌트 테스트</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                실제 데이터는 Zustand 스토어에서 가져옵니다. 
                이 테스트에서는 UI만 확인할 수 있습니다.
              </p>
              <DogList
                onAddNew={handleAddNew}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 폼 컴포넌트 테스트 */}
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>DogForm 컴포넌트 테스트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    variant={formMode === 'create' ? 'default' : 'outline'}
                    onClick={() => {
                      setFormMode('create');
                      setSelectedDog(null);
                    }}
                  >
                    등록 모드
                  </Button>
                  <Button
                    variant={formMode === 'edit' ? 'default' : 'outline'}
                    onClick={() => {
                      setFormMode('edit');
                      setSelectedDog(mockDogs[0]);
                    }}
                  >
                    수정 모드
                  </Button>
                </div>

                <DogForm
                  dog={formMode === 'edit' ? selectedDog || undefined : undefined}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 통합 테스트 */}
        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>통합 테스트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  실제 Firebase 연동 및 전체 플로우 테스트를 위해서는 
                  <code className="bg-muted px-2 py-1 rounded">/dogs</code> 페이지를 사용하세요.
                </p>
                
                <div className="flex gap-4">
                  <Button onClick={() => window.location.href = '/dogs'}>
                    실제 강아지 관리 페이지로 이동
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/ui-test'}
                  >
                    UI 컴포넌트 테스트 페이지
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">테스트 체크리스트</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✅ DogCard 컴포넌트 (3가지 변형)</li>
                    <li>✅ DogForm 컴포넌트 (등록/수정)</li>
                    <li>✅ DogList 컴포넌트 (검색/필터/정렬)</li>
                    <li>⏳ Firebase 연동 테스트</li>
                    <li>⏳ React Query 캐싱 테스트</li>
                    <li>⏳ 이미지 업로드 테스트</li>
                    <li>⏳ 에러 처리 테스트</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default DogTestPage;

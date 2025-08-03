'use client';

import React, { useState } from 'react';
import { Dog, DOG_BREEDS, SIZE_LABELS } from '@/types/dog';
import { useDogStore } from '@/store/dogStore';
import DogCard from './DogCard';
import {
  Button,
  Input,
  Select,
  Grid,
  Container,
  Loading,
  Badge
} from '@/components/ui';
import { cn } from '@/lib/utils';

interface DogListProps {
  onAddNew?: () => void;
  onEdit?: (dog: Dog) => void;
  onDelete?: (dog: Dog) => void;
  onView?: (dog: Dog) => void;
  className?: string;
}

const DogList: React.FC<DogListProps> = ({
  onAddNew,
  onEdit,
  onDelete,
  onView,
  className
}) => {
  const {
    dogs,
    isLoading,
    error,
    searchQuery,
    sortBy,
    sortOrder,
    filterBy,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setFilter,
    clearFilters,
    getFilteredDogs
  } = useDogStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const filteredDogs = getFilteredDogs();

  // 필터 옵션들
  const sortOptions = [
    { value: 'name', label: '이름순' },
    { value: 'age', label: '나이순' },
    { value: 'breed', label: '견종순' },
    { value: 'createdAt', label: '등록일순' }
  ];

  const sizeOptions = [
    { value: '', label: '모든 크기' },
    ...Object.entries(SIZE_LABELS).map(([value, label]) => ({
      value,
      label: label.split(' ')[0] // "소형견 (10kg 미만)" -> "소형견"
    }))
  ];

  const genderOptions = [
    { value: '', label: '모든 성별' },
    { value: 'male', label: '수컷' },
    { value: 'female', label: '암컷' }
  ];

  const breedOptions = [
    { value: '', label: '모든 견종' },
    ...DOG_BREEDS.map(breed => ({ value: breed, label: breed }))
  ];

  if (isLoading) {
    return (
      <Container className={className}>
        <div className="flex justify-center py-12">
          <Loading size="lg" text="강아지 목록을 불러오는 중..." />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={className}>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className={cn('py-6', className)}>
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">내 강아지들</h1>
          <p className="text-muted-foreground">
            총 {dogs.length}마리의 강아지가 등록되어 있습니다
          </p>
        </div>
        
        {onAddNew && (
          <Button onClick={onAddNew}>
            + 새 강아지 등록
          </Button>
        )}
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-card rounded-lg p-4 mb-6 space-y-4">
        {/* 검색바 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="강아지 이름, 견종으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              그리드
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              목록
            </Button>
          </div>
        </div>

        {/* 필터 및 정렬 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <Select
            placeholder="정렬"
            options={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value as 'name' | 'age' | 'breed' | 'createdAt')}
          />
          
          <Select
            placeholder="순서"
            options={[
              { value: 'asc', label: '오름차순' },
              { value: 'desc', label: '내림차순' }
            ]}
            value={sortOrder}
            onChange={(value) => setSortOrder(value as 'asc' | 'desc')}
          />
          
          <Select
            placeholder="크기"
            options={sizeOptions}
            value={filterBy.size || ''}
            onChange={(value) => setFilter({ size: value || undefined })}
          />
          
          <Select
            placeholder="성별"
            options={genderOptions}
            value={filterBy.gender || ''}
            onChange={(value) => setFilter({ gender: value || undefined })}
          />
          
          <Select
            placeholder="견종"
            options={breedOptions}
            value={filterBy.breed || ''}
            onChange={(value) => setFilter({ breed: value || undefined })}
            searchable
          />
          
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
          >
            필터 초기화
          </Button>
        </div>

        {/* 활성 필터 표시 */}
        {(searchQuery || Object.values(filterBy).some(Boolean)) && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary">
                검색: {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterBy.size && (
              <Badge variant="secondary">
                크기: {SIZE_LABELS[filterBy.size as keyof typeof SIZE_LABELS].split(' ')[0]}
                <button
                  onClick={() => setFilter({ size: undefined })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterBy.gender && (
              <Badge variant="secondary">
                성별: {filterBy.gender === 'male' ? '수컷' : '암컷'}
                <button
                  onClick={() => setFilter({ gender: undefined })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filterBy.breed && (
              <Badge variant="secondary">
                견종: {filterBy.breed}
                <button
                  onClick={() => setFilter({ breed: undefined })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* 결과 표시 */}
      {filteredDogs.length === 0 ? (
        <div className="text-center py-12">
          {dogs.length === 0 ? (
            <div>
              <p className="text-muted-foreground mb-4">
                아직 등록된 강아지가 없습니다.
              </p>
              {onAddNew && (
                <Button onClick={onAddNew}>
                  첫 번째 강아지 등록하기
                </Button>
              )}
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground mb-4">
                검색 조건에 맞는 강아지가 없습니다.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredDogs.length}마리의 강아지를 찾았습니다
            </p>
          </div>

          {viewMode === 'grid' ? (
            <Grid 
              cols={1} 
              gap="lg"
              responsive={{
                sm: 2,
                md: 3,
                lg: 4
              }}
            >
              {filteredDogs.map((dog: Dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  variant="default"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
            </Grid>
          ) : (
            <div className="space-y-4">
              {filteredDogs.map((dog: Dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  variant="compact"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default DogList;

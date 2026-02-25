'use client';

import React, { memo, useCallback, useMemo, useId } from 'react';
import { Dog, calculateAge, formatAge, SIZE_LABELS } from '@/types/dog';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui';
import { cn } from '@/lib/utils';

// ✅ AI 자동화 룰: 엄격한 타입 안전성
export interface DogCardProps {
  dog: Dog;
  variant?: 'default' | 'compact' | 'detailed';
  onEdit?: (dog: Dog) => void;
  onDelete?: (dog: Dog) => void;
  onView?: (dog: Dog) => void;
  className?: string;
  loading?: boolean;
  error?: string | null;
}

// 활동 수준 라벨 상수 정의
const ACTIVITY_LEVEL_LABELS = {
  low: '낮음',
  moderate: '보통',
  high: '높음',
  very_high: '매우 높음',
} as const;

// 성별 라벨 상수 정의
const GENDER_LABELS = {
  male: '수컷',
  female: '암컷',
} as const;

// ✅ AI 자동화 룰: React.memo로 성능 최적화
const DogCard: React.FC<DogCardProps> = memo(
  ({
    dog,
    variant = 'default',
    onEdit,
    onDelete,
    onView,
    className,
    loading = false,
    error = null,
  }) => {
    // ✅ AI 자동화 룰: 접근성을 위한 고유 ID 생성
    const cardId = useId();

    // ✅ AI 자동화 룰: useMemo를 통한 계산 최적화
    const computedData = useMemo(() => {
      const age = calculateAge(dog.birthDate);
      const ageText = formatAge(age);

      return {
        age,
        ageText,
        genderLabel: GENDER_LABELS[dog.gender],
        activityLevelLabel:
          ACTIVITY_LEVEL_LABELS[dog.activityLevel] || '알 수 없음',
        formattedBirthDate: new Date(dog.birthDate).toLocaleDateString('ko-KR'),
        formattedCreatedAt: new Date(dog.createdAt).toLocaleDateString('ko-KR'),
        formattedUpdatedAt:
          dog.updatedAt !== dog.createdAt
            ? new Date(dog.updatedAt).toLocaleDateString('ko-KR')
            : null,
        sizeLabel: SIZE_LABELS[dog.size] || '알 수 없음',
      };
    }, [dog]);

    // ✅ AI 자동화 룰: useCallback으로 이벤트 핸들러 최적화
    const handleEdit = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit?.(dog);
      },
      [dog, onEdit]
    );

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete?.(dog);
      },
      [dog, onDelete]
    );

    const handleView = useCallback(() => {
      onView?.(dog);
    }, [dog, onView]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // ✅ AI 자동화 룰: 키보드 접근성 지원
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleView();
        }
      },
      [handleView]
    );

    // ✅ AI 자동화 룰: 로딩 상태 처리
    if (loading) {
      return (
        <Card className={cn('animate-pulse', className)} aria-busy="true">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // ✅ AI 자동화 룰: 에러 상태 처리
    if (error) {
      return (
        <Card className={cn('border-destructive', className)}>
          <CardContent className="p-6">
            <div
              className="text-center text-destructive"
              role="alert"
              aria-live="polite"
            >
              <p className="font-medium">오류가 발생했습니다</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // ✅ AI 자동화 룰: 컴팩트 버전 (목록용) - 접근성 및 성능 개선
    if (variant === 'compact') {
      return (
        <Card
          className={cn(
            'cursor-pointer hover:shadow-md transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            className
          )}
          onClick={handleView}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-labelledby={`dog-name-${cardId}`}
          aria-describedby={`dog-info-${cardId}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={dog.profileImage}
                  alt={`${dog.name}의 프로필 사진`}
                  onError={e => {
                    // ✅ AI 자동화 룰: 이미지 로드 실패 처리
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <AvatarFallback aria-label={`${dog.name}의 이니셜`}>
                  {dog.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3
                  id={`dog-name-${cardId}`}
                  className="font-semibold text-lg truncate"
                >
                  {dog.name}
                </h3>
                <p
                  id={`dog-info-${cardId}`}
                  className="text-sm text-muted-foreground"
                >
                  {dog.breed}
                </p>
                <div className="flex items-center gap-2 mt-1" role="list">
                  <Badge variant="secondary" size="sm" role="listitem">
                    {computedData.ageText}
                  </Badge>
                  <Badge variant="outline" size="sm" role="listitem">
                    {dog.weight}kg
                  </Badge>
                  <Badge variant="outline" size="sm" role="listitem">
                    {computedData.sizeLabel}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEdit}
                    aria-label={`${dog.name} 정보 수정`}
                  >
                    수정
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // ✅ AI 자동화 룰: 상세 버전 - 향상된 접근성 및 구조화
    if (variant === 'detailed') {
      return (
        <Card
          className={cn('max-w-2xl', className)}
          role="article"
          aria-labelledby={`detailed-dog-name-${cardId}`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={dog.profileImage}
                    alt={`${dog.name}의 상세 프로필 사진`}
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <AvatarFallback aria-label={`${dog.name}의 이니셜`}>
                    {dog.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2
                    id={`detailed-dog-name-${cardId}`}
                    className="text-2xl font-bold"
                  >
                    {dog.name}
                  </h2>
                  <p className="text-lg text-muted-foreground">{dog.breed}</p>
                  <div
                    className="flex items-center gap-2 mt-2"
                    role="list"
                    aria-label="기본 정보"
                  >
                    <Badge variant="secondary" role="listitem">
                      {computedData.genderLabel}
                    </Badge>
                    <Badge variant="outline" role="listitem">
                      {computedData.ageText}
                    </Badge>
                    <Badge variant="outline" role="listitem">
                      {dog.weight}kg
                    </Badge>
                    {dog.isNeutered && (
                      <Badge variant="success" role="listitem">
                        중성화
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2" role="group" aria-label="액션 버튼">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEdit}
                    aria-label={`${dog.name} 정보 수정`}
                  >
                    수정
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    aria-label={`${dog.name} 삭제 (주의: 이 작업은 되돌릴 수 없습니다)`}
                  >
                    삭제
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ✅ AI 자동화 룰: 구조화된 정보 섹션 */}
            <section aria-labelledby={`basic-info-${cardId}`}>
              <h3 id={`basic-info-${cardId}`} className="font-semibold mb-3">
                기본 정보
              </h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">크기:</dt>
                  <dd className="ml-2">{computedData.sizeLabel}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">색상:</dt>
                  <dd className="ml-2">{dog.color}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">활동 수준:</dt>
                  <dd className="ml-2">{computedData.activityLevelLabel}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">생년월일:</dt>
                  <dd className="ml-2">
                    <time dateTime={dog.birthDate}>
                      {computedData.formattedBirthDate}
                    </time>
                  </dd>
                </div>
              </dl>
            </section>

            {/* ✅ AI 자동화 룰: 성격 정보 섹션 */}
            {dog.temperament.length > 0 && (
              <section aria-labelledby={`temperament-${cardId}`}>
                <h3 id={`temperament-${cardId}`} className="font-semibold mb-3">
                  성격
                </h3>
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="성격 특성"
                >
                  {dog.temperament.map(trait => (
                    <Badge
                      key={trait}
                      variant="secondary"
                      size="sm"
                      role="listitem"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* ✅ AI 자동화 룰: 설명 섹션 */}
            {dog.description && (
              <section aria-labelledby={`description-${cardId}`}>
                <h3 id={`description-${cardId}`} className="font-semibold mb-3">
                  설명
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {dog.description}
                </p>
              </section>
            )}

            {/* 의료 정보 */}
            <div>
              <h3 className="font-semibold mb-3">의료 정보</h3>
              <div className="space-y-2 text-sm">
                {dog.microchipId && (
                  <div>
                    <span className="text-muted-foreground">마이크로칩:</span>
                    <span className="ml-2 font-mono">{dog.microchipId}</span>
                  </div>
                )}
                {dog.registrationNumber && (
                  <div>
                    <span className="text-muted-foreground">등록번호:</span>
                    <span className="ml-2 font-mono">
                      {dog.registrationNumber}
                    </span>
                  </div>
                )}
                {dog.allergies.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">알레르기:</span>
                    <span className="ml-2">{dog.allergies.join(', ')}</span>
                  </div>
                )}
                {dog.medicalConditions.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">질병:</span>
                    <span className="ml-2">
                      {dog.medicalConditions.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 연락처 정보 */}
            {(dog.emergencyContact.name || dog.veterinarian.name) && (
              <div>
                <h3 className="font-semibold mb-3">연락처</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {dog.emergencyContact.name && (
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">
                        응급 연락처
                      </h4>
                      <div>{dog.emergencyContact.name}</div>
                      <div>{dog.emergencyContact.phone}</div>
                      <div className="text-xs text-muted-foreground">
                        {dog.emergencyContact.relationship}
                      </div>
                    </div>
                  )}

                  {dog.veterinarian.name && (
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">
                        수의사
                      </h4>
                      <div>{dog.veterinarian.name}</div>
                      <div>{dog.veterinarian.clinic}</div>
                      <div>{dog.veterinarian.phone}</div>
                      <div className="text-xs text-muted-foreground">
                        {dog.veterinarian.address}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="text-xs text-muted-foreground">
            <time dateTime={dog.createdAt}>
              등록일: {computedData.formattedCreatedAt}
            </time>
            {computedData.formattedUpdatedAt && (
              <span className="ml-4">
                <time dateTime={dog.updatedAt}>
                  수정일: {computedData.formattedUpdatedAt}
                </time>
              </span>
            )}
          </CardFooter>
        </Card>
      );
    }

    // ✅ AI 자동화 룰: 기본 버전 (그리드용) - 접근성 및 성능 개선
    return (
      <Card
        className={cn(
          'cursor-pointer hover:shadow-lg transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className
        )}
        onClick={handleView}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-labelledby={`default-dog-name-${cardId}`}
        aria-describedby={`default-dog-info-${cardId}`}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <div className="relative mb-4">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarImage
                  src={dog.profileImage}
                  alt={`${dog.name}의 프로필 사진`}
                  onError={e => {
                    // ✅ AI 자동화 룰: 이미지 로드 실패 처리
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <AvatarFallback aria-label={`${dog.name}의 이니셜`}>
                  {dog.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {dog.isNeutered && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="success"
                        size="sm"
                        className="absolute -top-1 -right-1"
                        aria-label="중성화 완료"
                      >
                        ✓
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>중성화 완료</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <h3
              id={`default-dog-name-${cardId}`}
              className="font-semibold text-lg mb-1"
            >
              {dog.name}
            </h3>
            <p
              id={`default-dog-info-${cardId}`}
              className="text-sm text-muted-foreground mb-3"
            >
              {dog.breed}
            </p>

            <div className="space-y-2">
              <div
                className="flex justify-center gap-2"
                role="list"
                aria-label="기본 특성"
              >
                <Badge variant="secondary" size="sm" role="listitem">
                  {computedData.genderLabel}
                </Badge>
                <Badge variant="outline" size="sm" role="listitem">
                  {computedData.ageText}
                </Badge>
              </div>

              <div
                className="flex justify-center gap-2"
                role="list"
                aria-label="체중과 크기"
              >
                <Badge variant="outline" size="sm" role="listitem">
                  {dog.weight}kg
                </Badge>
                <Badge variant="outline" size="sm" role="listitem">
                  {computedData.sizeLabel}
                </Badge>
              </div>

              {dog.temperament.length > 0 && (
                <div
                  className="flex justify-center flex-wrap gap-1 mt-3"
                  role="list"
                  aria-label="성격 특성"
                >
                  {dog.temperament.slice(0, 3).map(trait => (
                    <Badge
                      key={trait}
                      variant="secondary"
                      size="sm"
                      role="listitem"
                    >
                      {trait}
                    </Badge>
                  ))}
                  {dog.temperament.length > 3 && (
                    <Badge
                      variant="secondary"
                      size="sm"
                      role="listitem"
                      aria-label={`추가 성격 특성 ${dog.temperament.length - 3}개`}
                    >
                      +{dog.temperament.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="flex gap-2 w-full"
            role="group"
            aria-label="액션 버튼"
          >
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleEdit}
                aria-label={`${dog.name} 정보 수정`}
              >
                수정
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                aria-label={`${dog.name} 삭제`}
              >
                삭제
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }
);

// ✅ AI 자동화 룰: 디스플레이 네임 설정 (디버깅 및 React DevTools)
DogCard.displayName = 'DogCard';

export default DogCard;

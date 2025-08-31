'use client';

import React from 'react';
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
  TooltipContent
} from '@/components/ui';
import { cn } from '@/lib/utils';

export interface DogCardProps {
  dog: Dog;
  variant?: 'default' | 'compact' | 'detailed';
  onEdit?: (dog: Dog) => void;
  onDelete?: (dog: Dog) => void;
  onView?: (dog: Dog) => void;
  className?: string;
}

const DogCard: React.FC<DogCardProps> = ({
  dog,
  variant = 'default',
  onEdit,
  onDelete,
  onView,
  className
}) => {
  const age = calculateAge(dog.birthDate);
  const ageText = formatAge(age);

  // 컴팩트 버전 (목록용)
  if (variant === 'compact') {
    return (
      <Card 
        className={cn(
          'cursor-pointer hover:shadow-md transition-shadow',
          className
        )}
        onClick={() => onView?.(dog)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={dog.profileImage} alt={dog.name} />
              <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{dog.name}</h3>
              <p className="text-sm text-muted-foreground">{dog.breed}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" size="sm">
                  {ageText}
                </Badge>
                <Badge variant="outline" size="sm">
                  {dog.weight}kg
                </Badge>
                <Badge variant="outline" size="sm">
                  {SIZE_LABELS[dog.size]}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(dog);
                  }}
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

  // 상세 버전
  if (variant === 'detailed') {
    return (
      <Card className={cn('max-w-2xl', className)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={dog.profileImage} alt={dog.name} />
                <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{dog.name}</h2>
                <p className="text-lg text-muted-foreground">{dog.breed}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {dog.gender === 'male' ? '수컷' : '암컷'}
                  </Badge>
                  <Badge variant="outline">{ageText}</Badge>
                  <Badge variant="outline">{dog.weight}kg</Badge>
                  {dog.isNeutered && (
                    <Badge variant="success">중성화</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {onEdit && (
                <Button size="sm" variant="outline" onClick={() => onEdit(dog)}>
                  수정
                </Button>
              )}
              {onDelete && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onDelete(dog)}
                >
                  삭제
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="font-semibold mb-3">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">크기:</span>
                <span className="ml-2">{SIZE_LABELS[dog.size]}</span>
              </div>
              <div>
                <span className="text-muted-foreground">색상:</span>
                <span className="ml-2">{dog.color}</span>
              </div>
              <div>
                <span className="text-muted-foreground">활동 수준:</span>
                <span className="ml-2">
                  {dog.activityLevel === 'low' && '낮음'}
                  {dog.activityLevel === 'moderate' && '보통'}
                  {dog.activityLevel === 'high' && '높음'}
                  {dog.activityLevel === 'very_high' && '매우 높음'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">생년월일:</span>
                <span className="ml-2">
                  {new Date(dog.birthDate).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>

          {/* 성격 */}
          {dog.temperament.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">성격</h3>
              <div className="flex flex-wrap gap-2">
                {dog.temperament.map((trait) => (
                  <Badge key={trait} variant="secondary" size="sm">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 설명 */}
          {dog.description && (
            <div>
              <h3 className="font-semibold mb-3">설명</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {dog.description}
              </p>
            </div>
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
                  <span className="ml-2 font-mono">{dog.registrationNumber}</span>
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
                  <span className="ml-2">{dog.medicalConditions.join(', ')}</span>
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
                    <h4 className="font-medium text-muted-foreground mb-1">응급 연락처</h4>
                    <div>{dog.emergencyContact.name}</div>
                    <div>{dog.emergencyContact.phone}</div>
                    <div className="text-xs text-muted-foreground">
                      {dog.emergencyContact.relationship}
                    </div>
                  </div>
                )}
                
                {dog.veterinarian.name && (
                  <div>
                    <h4 className="font-medium text-muted-foreground mb-1">수의사</h4>
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
          등록일: {new Date(dog.createdAt).toLocaleDateString('ko-KR')}
          {dog.updatedAt !== dog.createdAt && (
            <span className="ml-4">
              수정일: {new Date(dog.updatedAt).toLocaleDateString('ko-KR')}
            </span>
          )}
        </CardFooter>
      </Card>
    );
  }

  // 기본 버전 (그리드용)
  return (
    <Card 
      className={cn(
        'cursor-pointer hover:shadow-lg transition-all duration-200 group',
        className
      )}
      onClick={() => onView?.(dog)}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <div className="relative mb-4">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={dog.profileImage} alt={dog.name} />
              <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {dog.isNeutered && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="success" 
                      size="sm"
                      className="absolute -top-1 -right-1"
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

          <h3 className="font-semibold text-lg mb-1">{dog.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{dog.breed}</p>

          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              <Badge variant="secondary" size="sm">
                {dog.gender === 'male' ? '수컷' : '암컷'}
              </Badge>
              <Badge variant="outline" size="sm">
                {ageText}
              </Badge>
            </div>
            
            <div className="flex justify-center gap-2">
              <Badge variant="outline" size="sm">
                {dog.weight}kg
              </Badge>
              <Badge variant="outline" size="sm">
                {dog.size === 'small' && '소형'}
                {dog.size === 'medium' && '중형'}
                {dog.size === 'large' && '대형'}
                {dog.size === 'giant' && '초대형'}
              </Badge>
            </div>

            {dog.temperament.length > 0 && (
              <div className="flex justify-center flex-wrap gap-1 mt-3">
                {dog.temperament.slice(0, 3).map((trait) => (
                  <Badge key={trait} variant="secondary" size="sm">
                    {trait}
                  </Badge>
                ))}
                {dog.temperament.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{dog.temperament.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2 w-full">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(dog);
              }}
            >
              수정
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(dog);
              }}
            >
              삭제
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DogCard;

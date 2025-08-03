'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Dog, 
  DogFormData, 
  DOG_BREEDS, 
  TEMPERAMENT_OPTIONS, 
  ACTIVITY_LEVEL_LABELS, 
  SIZE_LABELS,
} from '@/types/dog';
import {
  Button,
  Input,
  TextArea,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  ImageUpload,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  GridItem,
  Divider
} from '@/components/ui';
import { cn } from '@/lib/utils';

interface DogFormProps {
  dog?: Dog; // 수정 모드일 때 기존 데이터
  onSubmit: (data: DogFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

const DogForm: React.FC<DogFormProps> = ({
  dog,
  onSubmit,
  onCancel,
  isLoading = false,
  className
}) => {
  const isEditMode = !!dog;
  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>(
    dog?.temperament || []
  );
  // 알레르기와 의료 상태는 현재 폼에서 직접 관리하지 않고 향후 확장 예정
  const allergies = dog?.allergies || [];
  const medicalConditions = dog?.medicalConditions || [];

  const { 
    control, 
    handleSubmit, 
    setValue, 
    formState: { errors, isValid } 
  } = useForm<DogFormData>({
    defaultValues: {
      name: dog?.name || '',
      breed: dog?.breed || '',
      gender: dog?.gender || 'male',
      birthDate: dog?.birthDate || '',
      weight: dog?.weight || 0,
      profileImage: dog?.profileImage || undefined,
      description: dog?.description || '',
      isNeutered: dog?.isNeutered || false,
      microchipId: dog?.microchipId || '',
      registrationNumber: dog?.registrationNumber || '',
      color: dog?.color || '',
      size: dog?.size || 'medium',
      activityLevel: dog?.activityLevel || 'moderate',
      temperament: dog?.temperament || [],
      emergencyContact: {
        name: dog?.emergencyContact?.name || '',
        phone: dog?.emergencyContact?.phone || '',
        relationship: dog?.emergencyContact?.relationship || ''
      },
      veterinarian: {
        name: dog?.veterinarian?.name || '',
        clinic: dog?.veterinarian?.clinic || '',
        phone: dog?.veterinarian?.phone || '',
        address: dog?.veterinarian?.address || ''
      }
    },
    mode: 'onChange'
  });

  // 성격 선택 핸들러
  const handleTemperamentChange = (temperament: string, checked: boolean) => {
    const updated = checked
      ? [...selectedTemperaments, temperament]
      : selectedTemperaments.filter(t => t !== temperament);
    
    setSelectedTemperaments(updated);
    setValue('temperament', updated);
  };

  const onFormSubmit = async (data: DogFormData) => {
    try {
      await onSubmit({
        ...data,
        temperament: selectedTemperaments,
        allergies,
        medicalConditions
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="md">
              <GridItem span="full">
                <Controller
                  name="profileImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      label="프로필 사진"
                      value={field.value}
                      onChange={field.onChange}
                      acceptedTypes={['image/*']}
                      maxSize={5}
                      className="mb-4"
                    />
                  )}
                />
              </GridItem>

              <Controller
                name="name"
                control={control}
                rules={{
                  required: '이름을 입력해주세요',
                  minLength: { value: 1, message: '이름은 1글자 이상이어야 합니다' },
                  maxLength: { value: 20, message: '이름은 20글자 이하여야 합니다' },
                  pattern: {
                    value: /^[가-힣a-zA-Z\s]+$/,
                    message: '한글, 영문, 공백만 입력 가능합니다'
                  }
                }}
                render={({ field }) => (
                  <Input
                    label="이름 *"
                    placeholder="강아지 이름을 입력하세요"
                    error={errors.name?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="breed"
                control={control}
                rules={{ required: '견종을 선택해주세요' }}
                render={({ field }) => (
                  <Select
                    label="견종 *"
                    placeholder="견종을 선택하세요"
                    options={DOG_BREEDS.map(breed => ({ value: breed, label: breed }))}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.breed?.message}
                    searchable
                  />
                )}
              />

              <Controller
                name="gender"
                control={control}
                rules={{ required: '성별을 선택해주세요' }}
                render={({ field }) => (
                  <Radio
                    label="성별 *"
                    options={[
                      { value: 'male', label: '수컷' },
                      { value: 'female', label: '암컷' }
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.gender?.message}
                    name="gender"
                    orientation="horizontal"
                  />
                )}
              />

              <Controller
                name="birthDate"
                control={control}
                rules={{ 
                  required: '생년월일을 입력해주세요',
                  validate: (date) => {
                    const birth = new Date(date);
                    const now = new Date();
                    if (birth > now) return '미래 날짜는 선택할 수 없습니다';
                    if (birth < new Date(now.getFullYear() - 25, 0, 1)) {
                      return '25년 이전 날짜는 선택할 수 없습니다';
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <DatePicker
                    label="생년월일 *"
                    value={field.value ? new Date(Date.parse(field.value)) : new Date()}
                    onChange={field.onChange}
                    error={errors.birthDate?.message}
                  />
                )}
              />

              <Controller
                name="weight"
                control={control}
                rules={{
                  required: '체중을 입력해주세요',
                  min: { value: 0.1, message: '체중은 0.1kg 이상이어야 합니다' },
                  max: { value: 100, message: '체중은 100kg 이하여야 합니다' }
                }}
                render={({ field }) => (
                  <Input
                    label="체중 (kg) *"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    error={errors.weight?.message}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />

              <Controller
                name="color"
                control={control}
                rules={{ 
                  required: '색상을 입력해주세요',
                  maxLength: { value: 20, message: '색상은 20글자 이하여야 합니다' }
                }}
                render={({ field }) => (
                  <Input
                    label="색상 *"
                    placeholder="예: 갈색, 흰색, 검은색"
                    error={errors.color?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <Select
                    label="크기"
                    options={Object.entries(SIZE_LABELS).map(([value, label]) => ({
                      value,
                      label
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name="activityLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    label="활동 수준"
                    options={Object.entries(ACTIVITY_LEVEL_LABELS).map(([value, label]) => ({
                      value,
                      label
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <GridItem span="full">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      label="설명"
                      placeholder="강아지에 대한 추가 정보를 입력하세요"
                      rows={3}
                      {...field}
                    />
                  )}
                />
              </GridItem>
            </Grid>
          </CardContent>
        </Card>

        {/* 의료 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>의료 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="md">
              <Controller
                name="isNeutered"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="중성화 수술 완료"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name="microchipId"
                control={control}
                render={({ field }) => (
                  <Input
                    label="마이크로칩 번호"
                    placeholder="마이크로칩 번호를 입력하세요"
                    {...field}
                  />
                )}
              />

              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    label="등록번호"
                    placeholder="동물등록번호를 입력하세요"
                    {...field}
                  />
                )}
              />

              <GridItem span="full">
                <Divider label="성격" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                  {TEMPERAMENT_OPTIONS.map((temperament) => (
                    <Checkbox
                      key={temperament}
                      label={temperament}
                      checked={selectedTemperaments.includes(temperament)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTemperamentChange(temperament, e.target.checked)}
                    />
                  ))}
                </div>
              </GridItem>
            </Grid>
          </CardContent>
        </Card>

        {/* 응급 연락처 */}
        <Card>
          <CardHeader>
            <CardTitle>응급 연락처</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="md">
              <Controller
                name="emergencyContact.name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="이름"
                    placeholder="응급 연락처 이름"
                    {...field}
                  />
                )}
              />

              <Controller
                name="emergencyContact.phone"
                control={control}
                render={({ field }) => (
                  <Input
                    label="전화번호"
                    placeholder="010-0000-0000"
                    {...field}
                  />
                )}
              />

              <Controller
                name="emergencyContact.relationship"
                control={control}
                render={({ field }) => (
                  <Input
                    label="관계"
                    placeholder="예: 가족, 친구, 이웃"
                    {...field}
                  />
                )}
              />
            </Grid>
          </CardContent>
        </Card>

        {/* 수의사 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>수의사 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="md">
              <Controller
                name="veterinarian.name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="수의사 이름"
                    placeholder="담당 수의사 이름"
                    {...field}
                  />
                )}
              />

              <Controller
                name="veterinarian.clinic"
                control={control}
                render={({ field }) => (
                  <Input
                    label="병원명"
                    placeholder="동물병원 이름"
                    {...field}
                  />
                )}
              />

              <Controller
                name="veterinarian.phone"
                control={control}
                render={({ field }) => (
                  <Input
                    label="병원 전화번호"
                    placeholder="02-0000-0000"
                    {...field}
                  />
                )}
              />

              <Controller
                name="veterinarian.address"
                control={control}
                render={({ field }) => (
                  <Input
                    label="병원 주소"
                    placeholder="동물병원 주소"
                    {...field}
                  />
                )}
              />
            </Grid>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!isValid}
          >
            {isEditMode ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DogForm;

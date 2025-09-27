'use client';

import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { 
  Dog, 
  DogFormData, 
  DOG_BREEDS, 
  TEMPERAMENT_OPTIONS, 
  ACTIVITY_LEVEL_LABELS, 
  SIZE_LABELS,
} from '@/types/dog';
import { uploadDogProfileImage } from '@/lib/firebase/storage';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Label,
  TextArea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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

export interface DogFormProps {
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
  const { data: session } = useSession();
  const isEditMode = !!dog;
  const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>(
    dog?.temperament || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    dog?.profileImage
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
      profileImage: dog?.profileImage || '',
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

  // 이미지 변경 핸들러
  const handleImageChange = useCallback((file: File | File[] | null) => {
    if (file && !Array.isArray(file)) {
      setProfileImageFile(file);
      // 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setProfileImageUrl(previewUrl);
      setValue('profileImage', file);
    } else {
      setProfileImageFile(null);
      setProfileImageUrl(dog?.profileImage);
      setValue('profileImage', dog?.profileImage || '');
    }
  }, [dog, setValue]);

  const onFormSubmit = async (data: DogFormData) => {
    if (!session?.user?.id) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      setIsUploading(true);
      
      let finalImageUrl = profileImageUrl;
      
      // 새 이미지가 선택된 경우 Firebase Storage에 업로드
      if (profileImageFile) {
        try {
          finalImageUrl = await uploadDogProfileImage(
            profileImageFile,
            session.user.id,
            dog?.id
          );
          toast.success('이미지가 업로드되었습니다.');
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error('이미지 업로드에 실패했습니다.');
          setIsUploading(false);
          return;
        }
      }
      
      // 폼 데이터와 함께 제출
      const formData: DogFormData = {
        ...data,
        profileImage: finalImageUrl,
        temperament: selectedTemperaments,
        allergies,
        medicalConditions
      };
      
      await onSubmit(formData);
      
      // 성공 메시지
      toast.success(isEditMode ? '반려견 정보가 수정되었습니다.' : '반려견이 등록되었습니다.');
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
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
                  render={() => (
                    <div className="space-y-2">
                      <ImageUpload
                        label="프로필 사진"
                        value={profileImageFile || profileImageUrl}
                        defaultValue={profileImageUrl}
                        onChange={handleImageChange}
                        acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
                        maxSize={5}
                        preview={true}
                        disabled={isLoading || isUploading}
                        helperText="JPEG, PNG, WebP, GIF 형식, 최대 5MB"
                        className="mb-4"
                      />
                      {profileImageUrl && !profileImageFile && (
                        <p className="text-sm text-muted-foreground">
                          현재 프로필 이미지가 설정되어 있습니다.
                        </p>
                      )}
                    </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="dogName">이름 *</Label>
                    <Input
                      id="dogName"
                      placeholder="강아지 이름을 입력하세요"
                      {...field}
                    />
                    {errors.name?.message && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="breed"
                control={control}
                rules={{ required: '견종을 선택해주세요' }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dogBreed">견종 *</Label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="dogBreed">
                        <SelectValue placeholder="견종을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOG_BREEDS.map(breed => (
                          <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.breed?.message && (
                      <p className="text-sm text-red-500">{errors.breed.message}</p>
                    )}
                  </div>
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
                    return true;
                  }
                }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dogBirthDate">생년월일 *</Label>
                    <DatePicker
                      value={field.value ? new Date(Date.parse(field.value)) : new Date()}
                      onChange={field.onChange}
                    />
                    {errors.birthDate?.message && (
                      <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                    )}
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="dogWeight">체중 (kg) *</Label>
                    <Input
                      id="dogWeight"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                    {errors.weight?.message && (
                      <p className="text-sm text-red-500">{errors.weight.message}</p>
                    )}
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="dogColor">색상 *</Label>
                    <Input
                      id="dogColor"
                      placeholder="예: 갈색, 흰색, 검은색"
                      {...field}
                    />
                    {errors.color?.message && (
                      <p className="text-sm text-red-500">{errors.color.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dogSize">크기</Label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="dogSize">
                        <SelectValue placeholder="크기를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SIZE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <Controller
                name="activityLevel"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dogActivityLevel">활동 수준</Label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="dogActivityLevel">
                        <SelectValue placeholder="활동 수준을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ACTIVITY_LEVEL_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <GridItem span="full">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="dogDescription">설명</Label>
                      <TextArea
                        id="dogDescription"
                        placeholder="강아지에 대한 추가 정보를 입력하세요"
                        rows={3}
                        {...field}
                      />
                    </div>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNeutered"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="isNeutered">중성화 수술 완료</Label>
                  </div>
                )}
              />

              <Controller
                name="microchipId"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="microchipId">마이크로칩 번호</Label>
                    <Input
                      id="microchipId"
                      placeholder="마이크로칩 번호를 입력하세요"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">등록번호</Label>
                    <Input
                      id="registrationNumber"
                      placeholder="동물등록번호를 입력하세요"
                      {...field}
                    />
                  </div>
                )}
              />

              <GridItem span="full">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">성격</h3>
                  <Divider />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                  {TEMPERAMENT_OPTIONS.map((temperament) => (
                    <div key={temperament} className="flex items-center space-x-2">
                      <Checkbox
                        id={`temperament-${temperament}`}
                        checked={selectedTemperaments.includes(temperament)}
                        onCheckedChange={(checked) => handleTemperamentChange(temperament, checked as boolean)}
                      />
                      <Label htmlFor={`temperament-${temperament}`}>{temperament}</Label>
                    </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">이름</Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="응급 연락처 이름"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="emergencyContact.phone"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">전화번호</Label>
                    <Input
                      id="emergencyContactPhone"
                      placeholder="010-0000-0000"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="emergencyContact.relationship"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship">관계</Label>
                    <Input
                      id="emergencyContactRelationship"
                      placeholder="예: 가족, 친구, 이웃"
                      {...field}
                    />
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="veterinarianName">수의사 이름</Label>
                    <Input
                      id="veterinarianName"
                      placeholder="담당 수의사 이름"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="veterinarian.clinic"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="veterinarianClinic">병원명</Label>
                    <Input
                      id="veterinarianClinic"
                      placeholder="동물병원 이름"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="veterinarian.phone"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="veterinarianPhone">병원 전화번호</Label>
                    <Input
                      id="veterinarianPhone"
                      placeholder="02-0000-0000"
                      {...field}
                    />
                  </div>
                )}
              />

              <Controller
                name="veterinarian.address"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="veterinarianAddress">병원 주소</Label>
                    <Input
                      id="veterinarianAddress"
                      placeholder="동물병원 주소"
                      {...field}
                    />
                  </div>
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
            loading={isLoading || isUploading}
            disabled={!isValid || isLoading || isUploading}
          >
            {isUploading ? '이미지 업로드 중...' : (isEditMode ? '수정하기' : '등록하기')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DogForm;

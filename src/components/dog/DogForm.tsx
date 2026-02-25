'use client';

// === AI 자동화 룰: React 컴포넌트 자동 생성 패턴 ===
// 입력: 컴포넌트 이름, Props 타입, 주요 기능
// 출력: 완전한 React 컴포넌트 (타입 안전성, 접근성, 에러 처리, 성능 최적화 포함)

import React, { useState, useCallback, memo, useMemo, useId } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuthSupabase';
import {
  Dog,
  DogFormData,
  DOG_BREEDS,
  TEMPERAMENT_OPTIONS,
  ACTIVITY_LEVEL_LABELS,
  SIZE_LABELS,
} from '@/types/dog';
import { StorageService } from '@/lib/supabase/index';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Label,
  Textarea,
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
  Divider,
} from '@/components/ui';
import { cn } from '@/lib/utils';

// === AI 자동화: 타입 안전성 강화 ===
type FormStep = 'basic' | 'medical' | 'contact' | 'veterinarian';

interface FormState {
  step: FormStep;
  isSubmitting: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

interface ValidationError {
  field: keyof DogFormData;
  message: string;
}

// === AI 자동화: Props 인터페이스 강화 ===
export interface DogFormProps {
  /** 수정 모드일 때 기존 강아지 데이터 */
  dog?: Dog;
  /** 폼 제출 핸들러 - Promise 기반 비동기 처리 */
  onSubmit: (data: DogFormData) => Promise<void>;
  /** 취소 버튼 핸들러 */
  onCancel: () => void;
  /** 외부 로딩 상태 (선택적) */
  isLoading?: boolean;
  /** 커스텀 CSS 클래스명 */
  className?: string;
  /** 접근성: 폼 제목 (스크린 리더용) */
  'aria-label'?: string;
  /** 접근성: 폼 설명 ID 참조 */
  'aria-describedby'?: string;
}

// === AI 자동화: 최적화된 컴포넌트 구조 ===
const DogForm = memo<DogFormProps>(
  ({
    dog,
    onSubmit,
    onCancel,
    isLoading = false,
    className,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
  }) => {
    // === AI 자동화: 상태 관리 최적화 ===
    const { user } = useAuth();
    const formId = useId(); // 접근성: 고유 ID 생성
    const errorId = useId(); // 접근성: 에러 메시지 ID
    const isMountedRef = React.useRef(true);
    React.useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    // 메모이제이션된 계산 값들
    const isEditMode = useMemo(() => !!dog, [dog]);

    // 폼 상태 통합 관리
    const [formState, setFormState] = useState<FormState>({
      step: 'basic',
      isSubmitting: false,
      isUploading: false,
      uploadProgress: 0,
      error: null,
    });

    const [selectedTemperaments, setSelectedTemperaments] = useState<string[]>(
      () => dog?.temperament || []
    );
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
      () => dog?.profileImage
    );

    // === AI 자동화: 메모이제이션된 데이터 ===
    const allergies = useMemo(() => dog?.allergies || [], [dog?.allergies]);
    const medicalConditions = useMemo(
      () => dog?.medicalConditions || [],
      [dog?.medicalConditions]
    );

    const {
      control,
      handleSubmit,
      setValue,
      formState: { errors, isValid },
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
          relationship: dog?.emergencyContact?.relationship || '',
        },
        veterinarian: {
          name: dog?.veterinarian?.name || '',
          clinic: dog?.veterinarian?.clinic || '',
          phone: dog?.veterinarian?.phone || '',
          address: dog?.veterinarian?.address || '',
        },
      },
      mode: 'onChange',
    });

    // === AI 자동화: 최적화된 이벤트 핸들러 ===
    const handleTemperamentChange = useCallback(
      (temperament: string, checked: boolean) => {
        const updated = checked
          ? [...selectedTemperaments, temperament]
          : selectedTemperaments.filter(t => t !== temperament);

        setSelectedTemperaments(updated);
        setValue('temperament', updated);
      },
      [selectedTemperaments, setValue]
    );

    // 이미지 변경 핸들러
    const handleImageChange = useCallback(
      (file: File | File[] | null) => {
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
      },
      [dog, setValue]
    );

    // === AI 자동화: 에러 처리 강화된 폼 제출 ===
    const onFormSubmit: SubmitHandler<DogFormData> = useCallback(
      async (data: DogFormData) => {
        // 사전 검증
        if (!user?.id) {
          const errorMessage = '로그인이 필요합니다.';
          setFormState(prev => ({ ...prev, error: errorMessage }));
          toast.error(errorMessage);
          return;
        }

        try {
          // 제출 상태 시작
          setFormState(prev => ({
            ...prev,
            isSubmitting: true,
            isUploading: false,
            uploadProgress: 0,
            error: null,
          }));

          let finalImageUrl = profileImageUrl;

          // 이미지 업로드 단계
          if (profileImageFile) {
            setFormState(prev => ({ ...prev, isUploading: true }));

            try {
              finalImageUrl = await StorageService.uploadDogProfileImage(
                profileImageFile,
                user.id,
                dog?.id
              );
              setFormState(prev => ({ ...prev, uploadProgress: 100 }));
              toast.success('이미지가 업로드되었습니다.');
            } catch (uploadError) {
              const errorMessage = '이미지 업로드에 실패했습니다.';
              console.error('Image upload error:', uploadError);

              setFormState(prev => ({
                ...prev,
                error: errorMessage,
                isUploading: false,
                isSubmitting: false,
              }));
              toast.error(errorMessage);
              return;
            }
          }

          // 폼 데이터 준비
          const formData: DogFormData = {
            ...data,
            profileImage: finalImageUrl,
            temperament: selectedTemperaments,
            allergies,
            medicalConditions,
          };

          // 실제 제출 (부모 컴포넌트에서 toast 처리)
          await onSubmit(formData);
        } catch (error: unknown) {
          let errorMessage = '저장 중 오류가 발생했습니다.';

          if (error instanceof Error && error.message) {
            errorMessage = `저장 실패: ${error.message}`;

            // 특정 에러 코드에 대한 메시지
            const errorCode = (error as { code?: string }).code;
            if (
              errorCode === 'PGRST116' ||
              error.message.includes('does not exist')
            ) {
              errorMessage =
                '데이터베이스 테이블이 없습니다. Supabase Dashboard에서 SQL 마이그레이션을 실행해주세요.';
            } else if (
              error.message.includes('relation "dogs" does not exist')
            ) {
              errorMessage =
                'dogs 테이블이 없습니다. Supabase Dashboard에서 001_initial_schema.sql을 실행해주세요.';
            } else if (
              errorCode === '23503' &&
              error.message.includes('dogs_user_id_fkey')
            ) {
              errorMessage =
                '사용자 정보가 없습니다. 로그아웃 후 다시 로그인해주세요.';
            }
          }

          console.error('Form submission error:', error);

          if (isMountedRef.current) {
            setFormState(prev => ({
              ...prev,
              error: errorMessage,
              isSubmitting: false,
              isUploading: false,
            }));
            toast.error(errorMessage);
          }
        } finally {
          // 언마운트된 컴포넌트에서 setState 호출 방지
          if (isMountedRef.current) {
            setFormState(prev => ({
              ...prev,
              isSubmitting: false,
              isUploading: false,
              uploadProgress: 0,
            }));
          }
        }
      },
      [
        user?.id,
        profileImageUrl,
        profileImageFile,
        dog?.id,
        selectedTemperaments,
        allergies,
        medicalConditions,
        onSubmit,
      ]
    );

    // === AI 자동화: 접근성 강화된 렌더링 ===
    return (
      <div className={cn('max-w-4xl mx-auto', className)}>
        {/* 접근성: 스크린 리더를 위한 폼 제목 */}
        <div className="sr-only">
          <h1 id={`${formId}-title`}>
            {isEditMode ? '반려견 정보 수정' : '새 반려견 등록'}
          </h1>
          {ariaDescribedBy && (
            <p id={ariaDescribedBy}>
              반려견의 기본 정보, 의료 정보, 연락처 정보를 입력해주세요.
            </p>
          )}
        </div>

        {/* 전역 에러 표시 */}
        {formState.error && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
          >
            <h2 className="font-semibold text-sm mb-1">오류가 발생했습니다</h2>
            <p className="text-sm">{formState.error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="space-y-6"
          aria-label={
            ariaLabel || (isEditMode ? '반려견 정보 수정 폼' : '반려견 등록 폼')
          }
          aria-describedby={ariaDescribedBy}
          noValidate
        >
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
                          acceptedTypes={[
                            'image/jpeg',
                            'image/png',
                            'image/webp',
                            'image/gif',
                          ]}
                          maxSize={5}
                          preview={true}
                          disabled={isLoading}
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
                    minLength: {
                      value: 1,
                      message: '이름은 1글자 이상이어야 합니다',
                    },
                    maxLength: {
                      value: 20,
                      message: '이름은 20글자 이하여야 합니다',
                    },
                    pattern: {
                      value: /^[가-힣a-zA-Z\s]+$/,
                      message: '한글, 영문, 공백만 입력 가능합니다',
                    },
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
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
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
                            <SelectItem key={breed} value={breed}>
                              {breed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.breed?.message && (
                        <p className="text-sm text-red-500">
                          {errors.breed.message}
                        </p>
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
                        { value: 'female', label: '암컷' },
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
                    validate: date => {
                      const birth = new Date(date);
                      const now = new Date();
                      if (birth > now) return '미래 날짜는 선택할 수 없습니다';
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="dogBirthDate">생년월일 *</Label>
                      <DatePicker
                        value={
                          field.value
                            ? new Date(Date.parse(field.value))
                            : new Date()
                        }
                        onChange={field.onChange}
                      />
                      {errors.birthDate?.message && (
                        <p className="text-sm text-red-500">
                          {errors.birthDate.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="weight"
                  control={control}
                  rules={{
                    required: '체중을 입력해주세요',
                    min: {
                      value: 0.1,
                      message: '체중은 0.1kg 이상이어야 합니다',
                    },
                    max: {
                      value: 100,
                      message: '체중은 100kg 이하여야 합니다',
                    },
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
                        onChange={e =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                      {errors.weight?.message && (
                        <p className="text-sm text-red-500">
                          {errors.weight.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="color"
                  control={control}
                  rules={{
                    required: '색상을 입력해주세요',
                    maxLength: {
                      value: 20,
                      message: '색상은 20글자 이하여야 합니다',
                    },
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
                        <p className="text-sm text-red-500">
                          {errors.color.message}
                        </p>
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
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
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
                          {Object.entries(ACTIVITY_LEVEL_LABELS).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
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
                        <Textarea
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
                    {TEMPERAMENT_OPTIONS.map(temperament => (
                      <div
                        key={temperament}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`temperament-${temperament}`}
                          checked={selectedTemperaments.includes(temperament)}
                          onCheckedChange={checked =>
                            handleTemperamentChange(
                              temperament,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`temperament-${temperament}`}>
                          {temperament}
                        </Label>
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

          {/* === AI 자동화: 향상된 액션 버튼 === */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading || formState.isSubmitting}
              aria-label="폼 작성 취소"
            >
              취소
            </Button>
            <Button
              type="submit"
              loading={
                isLoading || formState.isSubmitting || formState.isUploading
              }
              disabled={
                !isValid ||
                isLoading ||
                formState.isSubmitting ||
                formState.isUploading
              }
              aria-label={
                isEditMode ? '반려견 정보 수정 완료' : '반려견 등록 완료'
              }
              aria-describedby={formState.error ? errorId : undefined}
            >
              {formState.isUploading
                ? `이미지 업로드 중... (${formState.uploadProgress}%)`
                : formState.isSubmitting
                  ? '저장 중...'
                  : isEditMode
                    ? '수정하기'
                    : '등록하기'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
);

// === AI 자동화: 컴포넌트 메타데이터 ===
DogForm.displayName = 'DogForm';

export default DogForm;

// === AI 자동화: 타입 내보내기 ===
export type { FormState, ValidationError };

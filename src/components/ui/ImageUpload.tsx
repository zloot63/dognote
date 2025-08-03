import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ImageUploadProps {
  value?: string | File;
  defaultValue?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  multiple?: boolean;
  maxSize?: number; // MB 단위
  acceptedTypes?: string[];
  preview?: boolean;
  cropAspectRatio?: number; // 가로/세로 비율
  className?: string;
  onChange?: (files: File | File[] | null) => void;
  onError?: (error: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  // value, defaultValue는 현재 사용되지 않음 - 향후 확장 예정
  // value,
  // defaultValue,
  label,
  error,
  helperText,
  disabled = false,
  multiple = false,
  maxSize = 5, // 5MB 기본값
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  preview = true,
  cropAspectRatio,
  className,
  onChange,
  onError,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 유효성 검사 - useCallback으로 감싸서 불필요한 재렌더링 방지
  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `지원하지 않는 파일 형식입니다. (${acceptedTypes.join(', ')})`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기가 ${maxSize}MB를 초과합니다.`;
    }
    
    return null;
  }, [acceptedTypes, maxSize]);

  // 파일 처리
  const handleFiles = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      onError?.(errors.join('\n'));
      return;
    }

    if (!multiple && validFiles.length > 1) {
      onError?.('하나의 파일만 선택할 수 있습니다.');
      return;
    }

    // 미리보기 URL 생성
    if (preview) {
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => {
        // 이전 URL들 정리
        prev.forEach(url => URL.revokeObjectURL(url));
        return multiple ? [...prev, ...urls] : urls;
      });
    }

    const newFiles = multiple ? [...uploadedFiles, ...validFiles] : validFiles;
    setUploadedFiles(newFiles);
    
    if (multiple) {
      onChange?.(newFiles);
    } else {
      onChange?.(validFiles[0] || null);
    }
  }, [multiple, uploadedFiles, preview, onChange, onError, validateFile]);

  // 드래그 앤 드롭 핸들러
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // 파일 제거
  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // 제거된 URL 정리
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setUploadedFiles(newFiles);
    setPreviewUrls(newUrls);
    
    if (multiple) {
      onChange?.(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange?.(null);
    }
  };

  // 파일 선택 트리거
  const triggerFileSelect = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // 컴포넌트 언마운트 시 URL 정리
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const hasFiles = uploadedFiles.length > 0;
  const acceptString = acceptedTypes.join(',');

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      {/* 업로드 영역 */}
      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors',
          dragActive && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:border-muted-foreground/50 cursor-pointer',
          error && 'border-destructive',
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptString}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {dragActive ? '파일을 놓아주세요' : '파일을 선택하거나 여기로 드래그하세요'}
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} 
              파일, 최대 {maxSize}MB
              {multiple && ', 여러 파일 선택 가능'}
            </p>
          </div>
        </div>
      </div>

      {/* 미리보기 영역 */}
      {preview && hasFiles && (
        <div className="space-y-2">
          <p className="text-sm font-medium">미리보기</p>
          <div className={cn(
            'grid gap-2',
            multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'
          )}>
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border bg-muted"
                style={{
                  aspectRatio: cropAspectRatio || 1,
                }}
              >
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority={index === 0}
                />
                
                {/* 제거 버튼 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* 파일 정보 오버레이 */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate">{uploadedFiles[index]?.name}</p>
                  <p>{(uploadedFiles[index]?.size / 1024 / 1024).toFixed(2)}MB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 파일 목록 (미리보기 없는 경우) */}
      {!preview && hasFiles && (
        <div className="space-y-2">
          <p className="text-sm font-medium">선택된 파일</p>
          <div className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-2 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate">{file.name}</span>
                  <span className="text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded-sm p-1 text-muted-foreground hover:text-destructive"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default ImageUpload;

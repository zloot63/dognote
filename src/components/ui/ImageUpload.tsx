"use client"

import * as React from 'react';
import Image from 'next/image';
import { UploadIcon, Cross2Icon, ImageIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

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

const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  ({
    value,
    defaultValue,
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
    ...props
  }, ref) => {
    const [dragActive, setDragActive] = React.useState(false);
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
    const [existingImageUrl, setExistingImageUrl] = React.useState<string | undefined>();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // 파일 유효성 검사
    const validateFile = React.useCallback((file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `지원하지 않는 파일 형식입니다. (${acceptedTypes.join(', ')})`;
      }
      
      if (file.size > maxSize * 1024 * 1024) {
        return `파일 크기가 너무 큽니다. (최대 ${maxSize}MB)`;
      }
      
      return null;
    }, [acceptedTypes, maxSize]);

    // 파일 처리
    const handleFiles = React.useCallback((files: FileList) => {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      
      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          onError?.(error);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      const newFiles = multiple ? [...uploadedFiles, ...validFiles] : validFiles;
      setUploadedFiles(newFiles);

      // 미리보기 URL 생성
      if (preview) {
        const newUrls = validFiles.map(file => URL.createObjectURL(file));
        const allUrls = multiple ? [...previewUrls, ...newUrls] : newUrls;
        
        // 기존 URL 정리
        if (!multiple) {
          previewUrls.forEach(url => URL.revokeObjectURL(url));
        }
        
        setPreviewUrls(allUrls);
      }

      // onChange 콜백 호출
      if (multiple) {
        onChange?.(newFiles);
      } else {
        onChange?.(validFiles[0] || null);
      }
    }, [uploadedFiles, previewUrls, multiple, preview, validateFile, onChange, onError]);

    // 드래그 앤 드롭 핸들러
    const handleDrag = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    }, []);

    const handleDrop = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (disabled) return;
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    }, [disabled, handleFiles]);

    // 파일 선택 핸들러
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    }, [handleFiles]);

    // 파일 제거
    const removeFile = React.useCallback((index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      const newUrls = previewUrls.filter((_, i) => i !== index);
      
      // URL 정리
      if (previewUrls[index] && previewUrls[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls[index]);
      }
      
      setUploadedFiles(newFiles);
      setPreviewUrls(newUrls);
      
      if (multiple) {
        onChange?.(newFiles.length > 0 ? newFiles : null);
      } else {
        onChange?.(null);
      }
    }, [uploadedFiles, previewUrls, multiple, onChange]);

    // 파일 선택 버튼 클릭
    const onButtonClick = React.useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    // value prop 처리 - 기존 이미지 URL 또는 File 객체
    React.useEffect(() => {
      if (value) {
        if (typeof value === 'string') {
          // 기존 이미지 URL인 경우
          setExistingImageUrl(value);
          setUploadedFiles([]);
          setPreviewUrls([]);
        } else if (value instanceof File) {
          // File 객체인 경우
          setUploadedFiles([value]);
          const url = URL.createObjectURL(value);
          setPreviewUrls([url]);
          setExistingImageUrl(undefined);
        }
      } else if (defaultValue && typeof defaultValue === 'string') {
        // defaultValue가 있는 경우
        setExistingImageUrl(defaultValue);
      }
    }, [value, defaultValue]);

    // 컴포넌트 언마운트 시 URL 정리
    React.useEffect(() => {
      return () => {
        previewUrls.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      };
    }, [previewUrls]);

    return (
      <div ref={ref} className={cn("grid gap-2", className)} {...props}>
        {label && (
          <Label className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive && "border-primary bg-primary/5",
            error && "border-destructive",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "hover:border-primary/50 cursor-pointer"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!disabled ? onButtonClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(',')}
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
          
          {uploadedFiles.length === 0 && !existingImageUrl ? (
            <div className="flex flex-col items-center justify-center text-center">
              <UploadIcon className="h-10 w-10 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {dragActive ? "파일을 여기에 놓으세요" : "파일을 업로드하세요"}
                </p>
                <p className="text-xs text-muted-foreground">
                  클릭하거나 파일을 드래그하여 업로드
                </p>
                <p className="text-xs text-muted-foreground">
                  {acceptedTypes.map(type => type.split('/')[1]).join(', ')} 파일, 최대 {maxSize}MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {preview && (previewUrls.length > 0 || existingImageUrl) && (
                <div className={cn(
                  "grid gap-4",
                  multiple ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
                )}>
                  {existingImageUrl && uploadedFiles.length === 0 ? (
                    <div className="relative group">
                      <div 
                        className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                        style={cropAspectRatio ? { aspectRatio: cropAspectRatio } : undefined}
                      >
                        <Image
                          src={existingImageUrl}
                          alt="Current profile"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExistingImageUrl(undefined);
                          onChange?.(null);
                        }}
                      >
                        <Cross2Icon className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                        style={cropAspectRatio ? { aspectRatio: cropAspectRatio } : undefined}
                      >
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <Cross2Icon className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {!preview && uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <Cross2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {multiple && (
                <div className="text-center">
                  <Button type="button" variant="outline" size="sm">
                    <UploadIcon className="h-4 w-4 mr-2" />
                    더 추가하기
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            "text-sm",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
ImageUpload.displayName = "ImageUpload";

export { ImageUpload };

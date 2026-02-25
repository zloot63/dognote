import { supabase } from '../supabase';

export interface UploadResult {
  path: string;
  fullPath: string;
  url: string;
}

export class StorageService {
  // 이미지 업로드
  static async uploadImage(
    file: File,
    path: string,
    options?: {
      cacheControl?: string;
      upsert?: boolean;
    }
  ): Promise<UploadResult> {
    const { data, error } = await supabase.storage
      .from('dog-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        ...options,
      });

    if (error) throw error;

    // 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from('dog-images').getPublicUrl(data.path);

    return {
      path: data.path,
      fullPath: data.fullPath,
      url: publicUrl,
    };
  }

  // 이미지 삭제
  static async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage.from('dog-images').remove([path]);

    if (error) throw error;
  }

  // 공개 URL 가져오기
  static async getPublicUrl(path: string): Promise<string> {
    const {
      data: { publicUrl },
    } = supabase.storage.from('dog-images').getPublicUrl(path);

    return publicUrl;
  }

  // 강아지 프로필 이미지 업로드 헬퍼
  static async uploadDogProfileImage(
    file: File,
    userId: string,
    dogId?: string
  ): Promise<string> {
    // 파일 확장자 추출
    const extension = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${timestamp}.${extension}`;

    // 경로 설정
    const path = dogId
      ? `dogs/${userId}/${dogId}/${fileName}`
      : `dogs/${userId}/temp/${fileName}`;

    const result = await this.uploadImage(file, path);
    return result.url;
  }
}

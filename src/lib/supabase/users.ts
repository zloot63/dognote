import { supabase } from '../supabase';
import { User } from '@/types/users';

export class UserService {
  // 사용자 정보 가져오기
  static async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // 사용자 정보 생성 또는 업데이트
  static async upsertUser(userData: {
    id: string;
    email: string;
    display_name?: string;
    photo_url?: string;
  }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // 사용자 정보 업데이트
  static async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

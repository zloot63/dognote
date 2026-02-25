import { supabase } from '../supabase';

// Utility function to ensure user exists in users table
// This can be called after login to ensure the user profile is created
export async function ensureUserProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('No authenticated user');
    }

    // Check if user exists in users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        email: user.email || '',
        display_name:
          user.user_metadata?.display_name || user.email?.split('@')[0],
        photo_url:
          user.user_metadata?.photo_url || user.user_metadata?.avatar_url,
      });

      if (insertError) {
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return false;
  }
}

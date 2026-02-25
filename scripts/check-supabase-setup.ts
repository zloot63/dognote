import { supabase } from '../src/lib/supabase';

async function checkTables() {
  console.warn('Checking Supabase tables...');

  try {
    // Check dogs table
    const { data: dogsData, error: dogsError } = await supabase
      .from('dogs')
      .select('count', { count: 'exact', head: true });

    if (dogsError) {
      console.error('❌ Dogs table error:', dogsError);
      console.warn(
        '\n⚠️  Solution: Run the SQL migration in Supabase Dashboard'
      );
      console.warn('1. Go to https://supabase.com/dashboard');
      console.warn('2. Select your project');
      console.warn('3. Go to SQL Editor');
      console.warn(
        '4. Run the SQL from /supabase/migrations/001_initial_schema.sql'
      );
    } else {
      console.warn('✅ Dogs table exists, count:', dogsData);
    }

    // Check users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (usersError) {
      console.error('❌ Users table error:', usersError);
    } else {
      console.warn('✅ Users table exists, count:', usersData);
    }

    // Check storage bucket
    const { data: buckets, error: bucketError } =
      await supabase.storage.listBuckets();

    if (bucketError) {
      console.error('❌ Storage error:', bucketError);
    } else {
      const dogImagesBucket = buckets?.find(b => b.name === 'dog-images');
      if (dogImagesBucket) {
        console.warn('✅ dog-images bucket exists');
      } else {
        console.warn('⚠️  dog-images bucket not found');
      }
    }
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

checkTables();

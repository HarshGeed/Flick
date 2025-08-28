import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function RootPage() {
  const session = await auth();
  
  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // If user is not authenticated, redirect to login
  redirect('/login');
}

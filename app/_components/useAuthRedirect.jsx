'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    console.log("user token", token)
    if (!token) {
      router.replace('/auth/login');
    }
  }, []);
};

export default useAuthRedirect;

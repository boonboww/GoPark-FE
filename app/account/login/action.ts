import API from '@/lib/api';
import { AxiosError } from 'axios';

export async function loginUser(email: string, password: string) {
  try {
    const res = await API.post('/users/login', { email, password });

    const token = res.data?.token;
    if (!token) return { error: 'No token received' };

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }

    return { data: res.data };
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;

    return {
      error: error.response?.data?.message || 'Login failed',
    };
  }
}

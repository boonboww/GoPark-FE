// app/account/login/action.ts
import API from '@/lib/api';
import { AxiosError } from 'axios';

export async function loginUser(email: string, password: string) {
  try {
    const res = await API.post('api/v1/users/login', { email, password });

    const token = res.data?.token;
    const role = res.data?.data?.user?.role;

    if (!token || !role) return { error: 'No token or role received' };

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    }

    return { data: { token, role } };
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return {
      error: error.response?.data?.message || 'Login failed',
    };
  }
}

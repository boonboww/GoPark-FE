'use server';

import API from '@/lib/api';

export async function signupUser(formData: {
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNumber?: string;
}) {
  try {
    const res = await API.post('/api/v1/users/signup', formData);
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || 'Signup failed' };
  }
}

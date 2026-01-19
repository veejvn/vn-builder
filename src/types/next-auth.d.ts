import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'USER';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'ADMIN' | 'USER';
  }

  interface JWT {
    id: string;
    role: 'ADMIN' | 'USER';
  }
}

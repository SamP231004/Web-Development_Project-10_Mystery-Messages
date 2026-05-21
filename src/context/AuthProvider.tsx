'use client';

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthUser } from '@/types/message';

const TOKEN_KEY = 'mystery_messages_token';
const USER_KEY = 'mystery_messages_user';

type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    signIn: (token: string, user: AuthUser) => void;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = window.localStorage.getItem(TOKEN_KEY);
        const storedUser = window.localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            const currentToken = token || window.localStorage.getItem(TOKEN_KEY);
            if (currentToken) {
                config.headers.Authorization = `Bearer ${currentToken}`;
            }
            return config;
        });

        return () => axios.interceptors.request.eject(interceptor);
    }, [token]);

    useEffect(() => {
        const protectedApiPaths = [
            '/api/accept-messages',
            '/api/get-messages',
            '/api/delete-messages',
        ];

        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;
                const url = error.config?.url ?? '';
                const isProtectedDashboardApi = protectedApiPaths.some((path) => url.startsWith(path));

                if ((status === 401 || status === 403) && isProtectedDashboardApi) {
                    window.localStorage.removeItem(TOKEN_KEY);
                    window.localStorage.removeItem(USER_KEY);
                    setToken(null);
                    setUser(null);
                    router.replace('/sign-in');
                }

                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [router]);

    useEffect(() => {
        if (isLoading) return;

        const authPage = pathname === '/sign-in' || pathname === '/sign-up' || pathname.startsWith('/verify');
        if (!user && pathname.startsWith('/dashboard')) {
            router.replace('/sign-in');
        }
        if (user && (authPage || pathname === '/')) {
            router.replace('/dashboard');
        }
    }, [isLoading, pathname, router, user]);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        token,
        isLoading,
        signIn: (newToken, newUser) => {
            window.localStorage.setItem(TOKEN_KEY, newToken);
            window.localStorage.setItem(USER_KEY, JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        },
        signOut: () => {
            window.localStorage.removeItem(TOKEN_KEY);
            window.localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
            router.replace('/sign-in');
        },
    }), [isLoading, router, token, user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}

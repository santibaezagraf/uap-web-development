import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { type RegisterData, type LoginData, type UserSettings } from '../types';
import { useAppDispatch } from '../store/hooks';
import { setCurrentPage } from '../store/uiSlice';

/**
 * Hook para manejar el registro de usuarios
 * Usa el método register del AuthContext que ya maneja el authService
 */
export function useRegisterMutation() {
    const { register } = useAuth();
    
    return useMutation({
        mutationFn: async (userData: RegisterData) => {
            console.log('🔐 Registering user:', userData.email);
            await register(userData.username, userData.email, userData.password);
            return userData; // Retornamos los datos para referencia
        },
        onSuccess: (userData) => {
            console.log('✅ Registration successful for:', userData.email);
        },
        onError: (error: any) => {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    });
}

/**
 * Hook para manejar el inicio de sesión
 * Usa el método login del AuthContext que ya maneja el authService
 */
export function useLoginMutation() {
    const { login } = useAuth();
    
    return useMutation({
        mutationFn: async (loginData: LoginData) => {
            console.log('🔐 Logging in user:', loginData.email);
            await login(loginData.email, loginData.password);
            return loginData; // Retornamos los datos para referencia
        },
        onSuccess: (loginData) => {
            console.log('✅ Login successful for:', loginData.email);
        },
        onError: (error: any) => {
            console.error('❌ Login failed:', error);
            throw error;
        }
    });
}

/**
 * Hook para manejar el cierre de sesión
 * Usa el método logout del AuthContext que ya maneja el authService
 */
export function useLogoutMutation() {
    const { logout } = useAuth();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            console.log('🚪 Logging out user...');
            await logout();
        },
        onSuccess: () => {
            console.log('✅ Logout successful');
            // Limpiar todas las queries cuando el usuario se deslogea
            queryClient.clear();
        },
        onError: (error: any) => {
            console.error('❌ Logout failed:', error);
            // El AuthContext ya maneja la limpieza del estado local
            queryClient.clear();
        }
    });
}

/**
 * Hook para actualizar las configuraciones del usuario
 * Usa el método updateSettings del AuthContext que ya maneja el authService
 */
export function useUpdateSettingsMutation() {
    const { updateSettings } = useAuth();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    
    return useMutation({
        mutationFn: async (settings: Partial<UserSettings>) => {
            console.log('⚙️ Updating user settings:', typeof settings.uppercase_descriptions);
            await updateSettings(settings);
            return settings; // Retornar los settings para usar en onSuccess
        },
        onSuccess: (settings) => {
            console.log('✅ Settings updated:', settings);
            
            // ✅ Si se cambió todos_per_page, resetear a la página 1 para evitar páginas vacías
            if (settings.todos_per_page) {
                dispatch(setCurrentPage(1));
            }
            
            // ✅ Invalidar las queries de todos para que reflejen los nuevos settings
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            // El AuthContext ya actualiza el estado interno
        },
        onError: (error: any) => {
            console.error('❌ Settings update failed:', error);
            throw error;
        }
    });
}

/**
 * Hook para refrescar el perfil del usuario
 * Usa el método refreshProfile del AuthContext que ya maneja el authService
 */
export function useRefreshProfileMutation() {
    const { refreshProfile } = useAuth();
    
    return useMutation({
        mutationFn: async () => {
            console.log('🔄 Refreshing user profile...');
            await refreshProfile();
        },
        onSuccess: () => {
            console.log('✅ Profile refreshed successfully');
        },
        onError: (error: any) => {
            console.error('❌ Profile refresh failed:', error);
            throw error;
        }
    });
}

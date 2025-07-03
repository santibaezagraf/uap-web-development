import React, { useState } from 'react';
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useUpdateSettingsMutation } from '../hooks/useAuthMutations';
import { useAuth } from '../context/AuthContext';

/**
 * Ejemplo de uso de los hooks de autenticación
 * Este archivo muestra cómo usar todos los hooks en componentes reales
 */

// 🔐 Ejemplo: Formulario de Login
export const LoginExample: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const loginMutation = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await loginMutation.mutateAsync({ email, password });
            // El usuario ya está autenticado automáticamente
            console.log('Login exitoso!');
        } catch (error) {
            console.error('Error en login:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button 
                type="submit" 
                disabled={loginMutation.isPending}
            >
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
            
            {loginMutation.error && (
                <div className="error">
                    Error: {loginMutation.error.message}
                </div>
            )}
        </form>
    );
};

// 📝 Ejemplo: Formulario de Registro
export const RegisterExample: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const registerMutation = useRegisterMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await registerMutation.mutateAsync({ username, email, password });
            console.log('Registro exitoso!');
        } catch (error) {
            console.error('Error en registro:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button 
                type="submit" 
                disabled={registerMutation.isPending}
            >
                {registerMutation.isPending ? 'Registering...' : 'Register'}
            </button>
            
            {registerMutation.error && (
                <div className="error">
                    Error: {registerMutation.error.message}
                </div>
            )}
        </form>
    );
};

// 🚪 Ejemplo: Botón de Logout
export const LogoutExample: React.FC = () => {
    const { user } = useAuth();
    const logoutMutation = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            console.log('Logout exitoso!');
        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    if (!user) return null;

    return (
        <div>
            <span>Bienvenido, {user.username}!</span>
            <button 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
            >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
};

// ⚙️ Ejemplo: Configuraciones del Usuario
export const SettingsExample: React.FC = () => {
    const { settings } = useAuth();
    const [refreshInterval, setRefreshInterval] = useState(settings?.refresh_interval || 5000);
    const [uppercaseDescriptions, setUppercaseDescriptions] = useState(settings?.uppercase_descriptions || false);
    
    const updateSettingsMutation = useUpdateSettingsMutation();

    const handleSave = async () => {
        try {
            await updateSettingsMutation.mutateAsync({
                refresh_interval: refreshInterval,
                uppercase_descriptions: uppercaseDescriptions
            });
            console.log('Configuraciones guardadas!');
        } catch (error) {
            console.error('Error guardando configuraciones:', error);
        }
    };

    return (
        <div>
            <h3>User Settings</h3>
            
            <div>
                <label>
                    Refresh Interval (ms):
                    <input
                        type="number"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        min="1000"
                        max="300000"
                    />
                </label>
            </div>
            
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={uppercaseDescriptions}
                        onChange={(e) => setUppercaseDescriptions(e.target.checked)}
                    />
                    Uppercase Descriptions
                </label>
            </div>
            
            <button 
                onClick={handleSave}
                disabled={updateSettingsMutation.isPending}
            >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </button>
            
            {updateSettingsMutation.error && (
                <div className="error">
                    Error: {updateSettingsMutation.error.message}
                </div>
            )}
            
            {updateSettingsMutation.isSuccess && (
                <div className="success">
                    Settings saved successfully!
                </div>
            )}
        </div>
    );
};

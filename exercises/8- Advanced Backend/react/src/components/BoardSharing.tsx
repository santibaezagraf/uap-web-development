import React, { useState } from 'react';
import { useBoardPermissions, useShareBoardMutation, useUpdatePermissionMutation, useRemovePermissionMutation } from '../hooks/usePermissions';
import { type BoardPermission } from '../types';

interface BoardSharingProps {
    boardId: number;
    boardName: string;
    userPermission: 'owner' | 'editor' | 'viewer';
}

export function BoardSharing({ boardId, boardName, userPermission }: BoardSharingProps) {
    const [shareEmail, setShareEmail] = useState('');
    const [sharePermission, setSharePermission] = useState<'editor' | 'viewer'>('viewer');
    const [isExpanded, setIsExpanded] = useState(false);

    // Hooks para permisos
    const { data: permissions = [], isLoading } = useBoardPermissions(boardId);
    const shareboardMutation = useShareBoardMutation();
    const updatePermissionMutation = useUpdatePermissionMutation();
    const removePermissionMutation = useRemovePermissionMutation();

    // Solo el owner puede compartir o modificar permisos
    const canManagePermissions = userPermission === 'owner';

    const handleShareBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shareEmail.trim()) return;

        try {
            await shareboardMutation.mutateAsync({
                board_id: boardId,
                user_email: shareEmail.trim(),
                permission_level: sharePermission
            });
            setShareEmail('');
        } catch (error) {
            console.error('Error sharing board:', error);
        }
    };

    const handleUpdatePermission = async (userId: number, newPermission: 'editor' | 'viewer') => {
        try {
            await updatePermissionMutation.mutateAsync({
                boardId,
                userId,
                permission_level: newPermission
            });
        } catch (error) {
            console.error('Error updating permission:', error);
        }
    };

    const handleRemovePermission = async (userId: number) => {
        if (window.confirm('Are you sure you want to remove this user\'s access?')) {
            try {
                await removePermissionMutation.mutateAsync({ boardId, userId });
            } catch (error) {
                console.error('Error removing permission:', error);
            }
        }
    };

    const getPermissionIcon = (permission: string) => {
        switch (permission) {
            case 'owner': return '👑';
            case 'editor': return '✏️';
            case 'viewer': return '👀';
            default: return '❓';
        }
    };

    const getPermissionColor = (permission: string) => {
        switch (permission) {
            case 'owner': return 'text-yellow-600 bg-yellow-100';
            case 'editor': return 'text-green-600 bg-green-100';
            case 'viewer': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <i className="fa-solid fa-share-nodes"></i>
                    Share "{boardName}"
                </h3>
                <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} transition-transform`}></i>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {/* Formulario para compartir (solo para owners) */}
                    {canManagePermissions && (
                        <form onSubmit={handleShareBoard} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Share with new user</h4>
                            <div className="flex gap-2 flex-wrap">
                                <input
                                    type="email"
                                    placeholder="Enter user email"
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                    className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded"
                                    required
                                />
                                <select
                                    value={sharePermission}
                                    onChange={(e) => setSharePermission(e.target.value as 'editor' | 'viewer')}
                                    className="p-2 border border-gray-300 rounded"
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={shareboardMutation.isPending}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                >
                                    {shareboardMutation.isPending ? 'Sharing...' : 'Share'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Lista de usuarios con acceso */}
                    <div>
                        <h4 className="font-medium mb-3">Users with access</h4>
                        
                        {isLoading ? (
                            <div className="flex items-center text-gray-500">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                Loading permissions...
                            </div>
                        ) : permissions.length === 0 ? (
                            <p className="text-gray-500 text-sm">No shared users yet</p>
                        ) : (
                            <div className="space-y-2">
                                {permissions.map((permission: BoardPermission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{getPermissionIcon(permission.permission_level)}</span>
                                            <div>
                                                <div className="font-medium">
                                                    {permission.username || 'Unknown User'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {permission.email}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionColor(permission.permission_level)}`}>
                                                {permission.permission_level}
                                            </span>
                                            
                                            {canManagePermissions && permission.permission_level !== 'owner' && (
                                                <div className="flex gap-1">
                                                    {permission.permission_level !== 'editor' && (
                                                        <button
                                                            onClick={() => handleUpdatePermission(permission.user_id, 'editor')}
                                                            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                            title="Make Editor"
                                                        >
                                                            Editor
                                                        </button>
                                                    )}
                                                    {permission.permission_level !== 'viewer' && (
                                                        <button
                                                            onClick={() => handleUpdatePermission(permission.user_id, 'viewer')}
                                                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                                            title="Make Viewer"
                                                        >
                                                            Viewer
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemovePermission(permission.user_id)}
                                                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                        title="Remove Access"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información sobre permisos */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                        <strong>Permission levels:</strong><br/>
                        👑 <strong>Owner:</strong> Full control, can share and manage permissions<br/>
                        ✏️ <strong>Editor:</strong> Can view and edit todos<br/>
                        👀 <strong>Viewer:</strong> Can only view todos
                    </div>
                </div>
            )}
        </div>
    );
}

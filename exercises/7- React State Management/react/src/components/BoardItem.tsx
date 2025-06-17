import type { Board } from '../types';
import { Link } from "@tanstack/react-router";
import { useAppDispatch } from '../store/hooks';
import { addNotification } from '../store/uiSlice';
import { useDeleteBoard } from '../hooks/useBoardMutations';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { setCurrentBoardId } from '../store/uiSlice';

type BoardItemProps = {
    board: Board;
    currentBoardId: number
    isLoading: boolean
}
export function BoardItem({ board, currentBoardId, isLoading }: BoardItemProps) {
        const dispatch = useAppDispatch()
        const deleteMutation = useDeleteBoard();
        const queryClient = useQueryClient();
        const navigate = useNavigate();
        

        const handleSelect = () => {
            if (isLoading) return;
            dispatch(addNotification({
                message: `Board ${board.name} selected successfully!`,
                type: 'success'
            }))
        }

        const handleDelete = async () => {
            // verificar si estamos borrando el tablero seleccionado actualmente
            const isCurrentBoard = currentBoardId === board.id;

            try {
                await deleteMutation.mutateAsync(board.id)

                // mostrar la notifiacion de exito
                dispatch(addNotification({
                message: `Board "${board.name}" deleted successfully!`,
                type: 'success' 
                }))

                if (isCurrentBoard) {
                    await queryClient.invalidateQueries({ queryKey: ['boards'] });

                    const boards = queryClient.getQueryData(['boards']) as Board[] || [];
                    console.log("Boards after deletion:", boards);

                    if (boards && boards.length > 0) {
                        navigate({ to: '/boards/$boardId', params: { boardId: boards[0].id.toString() } });
                        dispatch(setCurrentBoardId(boards[0].id));
                    } else {
                        navigate({ to: '/' }); // Redirigir a la página principal si no hay tableros
                    }
            }
            } catch (error) {
            console.error("Error deleting board", error);
            dispatch(addNotification({
                message: `Error deleting board: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error' 
            }))
        }
        
            
        }
    

    return (
        <>
            <Link
                onClick={handleSelect}
                key={board.id}
                to="/boards/$boardId"
                params={{ boardId: board.id.toString() }}
                className={`flex-grow text-center font-montserrat font-bold text-2xl tracking-wider py-2 px-2 m-0 
                    hover:opacity-100 cursor-pointer transition-opacity duration-500 border-b-4 ${
                    currentBoardId === board.id
                        ? 'border-orange-500 opacity-100'
                        : 'border-transparent opacity-50'
                }`}
            >
                {board.name}
            </Link>

            <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className={`flex-shrink-0 bg-transparent border-0 text-orange-500 text-base px-2 cursor-pointer ${
                    deleteMutation.isPending ? 'opacity-50' : ''
                }`}
                title="Delete"
            >
                {deleteMutation.isPending ? '...' : <i className="fa-solid fa-trash"></i>}
            </button>
        </>
    )
}
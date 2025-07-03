// import { useBoards } from '../hooks/useBoards';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { startCreatingBoard } from '../store/uiSlice';
import type { Board } from '../types';
import { Link } from "react-router-dom";
import { BoardItem } from './BoardItem';
import { useQueryClient } from '@tanstack/react-query';

export function BoardsList() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId);

    const boards = queryClient.getQueryData<Board[]>(['boards']) || [];

    const handleCreateBoard = () => {
        dispatch(startCreatingBoard());
    }


    return (
        <div className="flex items-center bg-[rgba(243,243,243,255)]">
            {boards.map((board: Board) => (
                <BoardItem
                    key={board.id}
                    board={board}
                    currentBoardId={currentBoardId}
                    isLoading={false}
                />
            ))}

            {/* Create new board */}
            <button
                onClick={handleCreateBoard}
                className="flex-shrink-0 bg-[rgba(173,131,131,255)] text-[rgba(243,243,243,255)] font-inter  border-0 py-2 px-4 hover:bg-[rgb(202,68,68)] hover:text-white transition-colors duration-500"
            >
                <span className="text-4xl">+</span>
            </button>

            {/* Settings */}
            <Link 
                to="/settings"                
                className="flex-shrink-0 bg-[rgb(116,178,202)] text-[rgba(243,243,243,255)] font-inter border-0 py-2 px-2 hover:bg-[rgb(202,68,68)] hover:text-white transition-colors duration-500"
            >
                <span className="text-4xl">⚙️</span>
            </Link>
        </div>
    )
}
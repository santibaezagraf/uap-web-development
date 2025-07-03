import { useState } from 'react';
import { useBoards } from '../hooks/useBoards';
import { useCreateBoard } from '../hooks/useBoardMutations';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentBoardId, startCreatingBoard } from '../store/uiSlice';
import { addNotification } from '../store/uiSlice';
import type { Board } from '../types';
import { Link } from "@tanstack/react-router";
import { BoardItem } from './BoardItem';

export function BoardsList() {
    const dispatch = useAppDispatch();
    // const createBoard = useCreateBoard();
    const {data: boards = [], isLoading } = useBoards();
    const currentBoardId = useAppSelector((state) => state.ui.currentBoardId);




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
                    isLoading={isLoading}
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
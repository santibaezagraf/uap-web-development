import { AddToDo } from '../components/AddToDo'
import { FilterTasksWithContext } from '../components/FilterTasks'
import { ToDoListWithContext } from '../components/ToDoList'
import { ClearCompletedWithContext } from '../components/ClearCompleted'
import { Notifications } from '../components/Notifications'
import { useAppDispatch } from '../store/hooks'
import { setCurrentBoardId, setCurrentPage } from '../store/uiSlice'
import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'


export function Index() {    
    const dispatch = useAppDispatch();
    const { boardId } = useParams({ from: '/boards/$boardId' });

    // Use useEffect to handle the boardId change to avoid infinite re-renders
    useEffect(() => {
        dispatch(setCurrentBoardId(parseInt(boardId, 10) || 1)); // Set a default board ID if none is provided
    }, [boardId, dispatch]);

    return (
        <>
            <AddToDo/>
                <div className='w-1/2 my-5 mt-2 p-2 bg-[rgba(241,236,230,255)] rounded-3xl'>
                    <FilterTasksWithContext onFilterChange={() => dispatch(setCurrentPage(1))}/>
                    <ToDoListWithContext />
                    <ClearCompletedWithContext />

                </div>              
            <Notifications />
        </>
    )
}
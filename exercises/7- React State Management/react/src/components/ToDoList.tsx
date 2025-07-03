import { ToDoItem } from "./ToDoItem";
// import { usePagination } from "../context/PaginationContext";
import { useTodos } from "../hooks/useTodos";
import type { TodoItem } from "../types";
import { Pagination } from "./Pagination";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCurrentPage } from "../store/uiSlice";

// interface ToDoListWithContextProps {
//     currentPage: number;
//     setCurrentPage: (page: number) => void;
// }

export function ToDoListWithContext() { //{ currentPage, setCurrentPage }: ToDoListWithContextProps
    // Usamos el hook que ahora internamente ya usa el contexto del filtro
    // const {  currentPage: paginationCurrentPage, itemsPerPage: paginationItemsPerPage, setTotalItems, setTotalPages, setCurrentPage, setItemsPerPage } = usePagination();


    // const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage, setItemsPerPage] = useState(5);
    const {currentPage, itemsPerPage } = useAppSelector((state) => state.ui.pagination);
    const dispatch = useAppDispatch();

    const { data, isLoading, isError } = useTodos({ page: currentPage, limit: itemsPerPage });
    
    const { pagination: { totalPages } = { totalPages: 1 }, todos = [] } = data || {};

    // setItemsPerPage(pgItemsPerPage);



    // const { data, isLoading, isError } = useTodos();
    // const { 
    //     pagination: { 
    //         currentPage: pgCurrentPage , 
    //         itemsPerPage: pgItemsPerPage , 
    //         totalItems: pgTotalItems , 
    //         totalPages: pgTotalPages  
    //     } = {}, 
    //     todos = [] 
    // } = data || {};
    // console.log(useTodos());

    // const [currentPage, setCurrentPage] = useState(pgCurrentPage);
    // const [itemsPerPage, setItemsPerPage] = useState(pgItemsPerPage);

    
    
    

    // useEffect(() => {
        
    //     setTotalItems(totalItems);
    //     setTotalPages(totalPages);
    //     setCurrentPage(currentPage);
    //     setItemsPerPage(itemsPerPage);

    // }, [currentPage, totalItems, totalPages, itemsPerPage]);

    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const endIndex = Math.min(startIndex + itemsPerPage, todos.length);
    // const paginatedTodos = todos.slice(startIndex, endIndex);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading tasks...</span>
            </div>
        );
    }
    
    if (isError) {
        return (
            <div className="text-red-500 p-4 text-center">
                Error loading tasks.
            </div>
        );
    }

    if (!todos || todos.length === 0) {
        return (
            <div className="text-gray-500 p-4 text-center">
                No available tasks
            </div>
        );
    }

    return (
        <>
            <ul className="list-none p-0 m-0">
                {todos.map((todo: TodoItem) => (
                    <ToDoItem
                        key={todo.id}
                        todo={todo}
                    />
                ))}
            </ul>    

            <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {dispatch(setCurrentPage(page))}}
            />

        </>
        
    );
}

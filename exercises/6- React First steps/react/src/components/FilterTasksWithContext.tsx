import type { FormEvent } from "react";
import { useFilter } from "../context/FilterContext";
import { useAppDispatch } from "../store/hooks";
import { addNotification } from "../store/uiSlice";


export const FilterTasksWithContext = () => {
    const { filter, setFilter } = useFilter();
    const dispatch = useAppDispatch();
    
    const handleFilterChange = (event: FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const target = event.target as HTMLButtonElement;
        const selectedFilter = target.value;
        setFilter(selectedFilter);
        dispatch(addNotification({
            message: `Filter changed to: ${selectedFilter}`,
            type: 'info'
        }));
    }
        
    return (
        <div className="flex justify-around items-center my-5">
            <button 
                type="button"
                value="all" 
                className={`w-3/10 bg-[rgb(116,178,202)] text-white font-montserrat text-2xl py-2 px-5 border-0 rounded-full border-b-4 border-orange-300 hover:opacity-100 transition-all duration-500 ${filter === "all" ? 'opacity-100 shadow-md' : ' opacity-50'} shadow-black`}
                onClick={handleFilterChange}
            >
                Show all
            </button>
            <button 
                type="button"
                value="completed" 
                className={`w-3/10 bg-[rgb(116,178,202)] text-white font-montserrat text-2xl py-2 px-5 border-0 rounded-full border-b-4 border-orange-300 hover:opacity-100 transition-all duration-500 ${filter === "completed" ? 'opacity-100 shadow-md' : ' opacity-50'} shadow-black`}
                onClick={handleFilterChange}
            >
                Completed
            </button>
            <button 
                type="button"
                value="uncompleted" 
                className={`w-3/10 bg-[rgb(116,178,202)] text-white font-montserrat text-2xl py-2 px-5 border-0 rounded-full border-b-4 border-orange-300 hover:opacity-100 transition-all duration-500 ${filter === "uncompleted" ? 'opacity-100 shadow-md' : ' opacity-50'} shadow-black`}
                onClick={handleFilterChange}
            >
                Uncompleted
            </button>
        </div>
    );
}

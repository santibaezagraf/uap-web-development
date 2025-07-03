import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setItemsPerPage, setRefetchInterval, setUppercaseDescriptions } from '../store/uiSlice'


export function Settings() {
    const dispatch = useAppDispatch()
    const { itemsPerPage } = useAppSelector(state => state.ui.pagination)
    const { refetchInterval, uppercaseDescriptions } = useAppSelector(state => state.ui.config)
    const isCreatingBoard = useAppSelector(state => state.ui.isCreatingBoard)
    
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10)
        dispatch(setItemsPerPage(value))
    }
    
    const handleRefetchIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Convertimos de segundos a milisegundos
        const valueInMs = parseInt(e.target.value, 10) * 1000
        dispatch(setRefetchInterval(valueInMs))
    }
    
    const handleUppercaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setUppercaseDescriptions(e.target.checked))
    }
    
    return (
        <div className="w-1/2 my-5 p-4 bg-[rgba(241,236,230,255)] rounded-3xl">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            
            <div className="mb-4">
                <label htmlFor="itemsPerPage" className="block mb-2 font-medium">
                    Items Per Page:
                </label>
                <select 
                    id="itemsPerPage" 
                    className="p-2 rounded border border-gray-300"
                    onChange={handleItemsPerPageChange}
                    value={itemsPerPage}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>
              <div className="mb-4">
                <label htmlFor="refetchInterval" className="block mb-2 font-medium">
                    Refetch tasks interval (seconds):
                </label>
                <input 
                    id="refetchInterval" 
                    type="number" 
                    className="p-2 rounded border border-gray-300 w-full"
                    onChange={handleRefetchIntervalChange}
                    value={refetchInterval / 1000}
                    min="1"
                    max="60"
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="uppercaseDescriptions" className="flex items-center mb-2 font-medium">
                    <input 
                        id="uppercaseDescriptions" 
                        type="checkbox" 
                        className="mr-2 h-5 w-5"
                        onChange={handleUppercaseChange}
                        checked={uppercaseDescriptions}
                    />
                    Show tasks in upper case
                </label>
            </div>
            
            <hr className="my-6 border-gray-300" />
            
        </div>
    )
}
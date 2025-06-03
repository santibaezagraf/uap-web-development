import { createContext, useContext, type ReactNode, useState } from 'react';

export type FilterContextType = {
  filter: string;
  setFilter: (filter: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

/**
 * Provider que almacena el estado del filtro actual
 */
export function FilterProvider({ children, initialFilter = 'all' }: { children: ReactNode; initialFilter?: string }) {
  const [filter, setFilter] = useState<string>(initialFilter);

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

/**
 * Hook personalizado para acceder al contexto del filtro
 */
export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter debe usarse dentro de un FilterProvider');
  }
  return context;
}

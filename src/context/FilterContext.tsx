// src/context/FilterContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface FilterContextProps {
  filter: string;
  setFilter: (value: string) => void;
  clearFilter: () => void;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider: React.FC = ({ children }) => {
  const [filter, setFilter] = useState("");

  const clearFilter = () => {
    setFilter("");
  };

  return (
    <FilterContext.Provider value={{ filter, setFilter, clearFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

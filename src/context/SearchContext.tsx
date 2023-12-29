// SearchContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface SearchContextProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: (q: number) => void;
}

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface ProviderProps { 
  children: React.ReactNode;
}

export const SearchProvider: React.FC<ProviderProps> = ({ children }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <SearchContext.Provider value={{ search, setSearch, currentPage, setCurrentPage }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
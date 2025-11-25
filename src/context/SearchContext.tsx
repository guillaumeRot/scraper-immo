'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

type SearchParams = {
  ville?: string;
  type?: string;
  sort?: string;
};

type SearchContextType = {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

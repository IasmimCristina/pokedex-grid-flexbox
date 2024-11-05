
import { createContext } from "react";

type FilterContextType = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

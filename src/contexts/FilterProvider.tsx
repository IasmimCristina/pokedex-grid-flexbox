
import  { useState, useMemo, ReactNode } from "react";
import { FilterContext } from "./FilterContext";

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState("");

  const value = useMemo(() => ({ filter, setFilter }), [filter]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

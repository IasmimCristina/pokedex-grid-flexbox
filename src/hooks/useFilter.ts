import { useContext } from "react";
import { FilterContext } from "../contexts/FilterContext";
import { ERROR_MESSAGES } from "../helpers/constants";

const useFilter = () => {
  const context = useContext(FilterContext);

  if (context === undefined) {
    throw new Error(ERROR_MESSAGES.FILTER_CONTEXT);
  }

  const { filter, setFilter } = context;

  const clearFilter = () => {
    setFilter("");
  };

  return { filter, setFilter, clearFilter };
};

export default useFilter;

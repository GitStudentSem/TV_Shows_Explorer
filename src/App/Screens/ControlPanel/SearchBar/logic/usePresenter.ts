import type { ChangeEvent, SubmitEvent } from "react";
import { searchStore } from "../../../../../stores/SearchStore";
import { useTermDebounce } from "./useTermDebounce";

export function usePresenter() {
  const { schedule, flush } = useTermDebounce();

  return {
    query: searchStore.query,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      searchStore.setQuery(value);
      schedule(value.trim());
    },
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      flush();
    },
  };
}

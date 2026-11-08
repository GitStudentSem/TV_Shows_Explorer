import type { ChangeEvent, SubmitEvent } from "react";
import { searchStore } from "../../stores/SearchStore";

export function usePresenter() {
  return {
    query: searchStore.query,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => {
      searchStore.setQuery(event.target.value);
    },
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      searchStore.submit();
    },
  };
}

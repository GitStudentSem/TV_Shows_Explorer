import type { ChangeEvent } from "react";
import { searchStore } from "../../../../../stores/SearchStore";
import { selectGenre } from "./tasks/selectGenre";

/** Значение пункта «Все жанры»: у `<select>` значение — всегда строка. */
const ALL = "";

export function usePresenter() {
  const { genre, result } = searchStore;
  const { genres, totalCount } = result;

  return {
    value: genre ?? ALL,
    // До первой выдачи выбирать не из чего: список есть, но не нажимается.
    isDisabled: genres.length === 0,
    options: [
      {
        value: ALL,
        label: totalCount > 0 ? `Все жанры · ${totalCount}` : "Все жанры",
      },
      ...genres.map(({ name, count }) => ({
        value: name,
        label: `${name} · ${count}`,
      })),
    ],
    handleChange: (event: ChangeEvent<HTMLSelectElement>) => {
      selectGenre(event.target.value || null);
    },
  };
}

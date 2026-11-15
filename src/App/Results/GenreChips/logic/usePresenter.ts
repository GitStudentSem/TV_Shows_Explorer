import { searchStore } from "../../../../stores/SearchStore";
import { selectGenre } from "./tasks/selectGenre";

export function usePresenter() {
  const { genre: selectedGenre, result } = searchStore;
  const { genres, totalCount } = result;

  return {
    isVisible: genres.length > 0,
    totalCount,
    isAllSelected: selectedGenre === null,
    selectAll: () => selectGenre(null),
    genres: genres.map(({ name, count }) => ({
      name,
      count,
      isSelected: selectedGenre === name,
      onSelect: () => selectGenre(name),
    })),
  };
}

import { searchStore } from "../../../../stores/SearchStore";

export function usePresenter() {
  const { genre: selectedGenre, result } = searchStore;
  const { genres, totalCount } = result;

  return {
    isVisible: genres.length > 0,
    totalCount,
    isAllSelected: selectedGenre === null,
    selectAll: () => searchStore.selectGenre(null),
    genres: genres.map(({ name, count }) => ({
      name,
      count,
      isSelected: selectedGenre === name,
      onSelect: () => searchStore.selectGenre(name),
    })),
  };
}

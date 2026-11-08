import { showsListStore } from "../../../stores/ShowsListStore";

export function usePresenter() {
  const { genres, selectedGenre, totalCount } = showsListStore;

  return {
    isVisible: genres.length > 0,
    totalCount,
    isAllSelected: selectedGenre === null,
    selectAll: () => showsListStore.selectGenre(null),
    genres: genres.map(({ name, count }) => ({
      name,
      count,
      isSelected: selectedGenre === name,
      onSelect: () => showsListStore.selectGenre(name),
    })),
  };
}

import { showsStore } from "../../../stores/ShowsStore";

export function usePresenter() {
  const { genres, selectedGenre, shows } = showsStore;

  return {
    isVisible: genres.length > 0,
    totalCount: shows.length,
    isAllSelected: selectedGenre === null,
    selectAll: () => showsStore.selectGenre(null),
    genres: genres.map(({ name, count }) => ({
      name,
      count,
      isSelected: selectedGenre === name,
      onSelect: () => showsStore.selectGenre(name),
    })),
  };
}

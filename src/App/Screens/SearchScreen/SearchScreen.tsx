import { TvScreen } from "../components/TvScreen/TvScreen";
import { Pagination } from "./Pagination/Pagination";
import { Results } from "./Results/Results";
import { SearchBar } from "./SearchBar/SearchBar";

export interface SearchScreenProps {
  isWarmingUp: boolean;
}

/** Канал поиска: строка поиска и выдача на экране, страницы — под ним. */
export function SearchScreen({ isWarmingUp }: SearchScreenProps) {
  return (
    <>
      <TvScreen>
        <SearchBar />
        <Results isWarmingUp={isWarmingUp} />
      </TvScreen>
      <Pagination />
    </>
  );
}

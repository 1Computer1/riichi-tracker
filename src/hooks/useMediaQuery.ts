import { useLayoutEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const update = () => {
      setMatches(window.matchMedia(query).matches);
    };

    const matchMedia = window.matchMedia(query);

    update();
    matchMedia.addEventListener("change", update);

    return () => {
      matchMedia.removeEventListener("change", update);
    };
  }, [query]);

  return matches;
}

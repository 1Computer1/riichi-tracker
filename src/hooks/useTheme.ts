import useLocalStorage from "./useLocalStorage";
import { useMediaQuery } from "./useMediaQuery";

export function useTheme(): "dark" | "light" {
  const [theme] = useLocalStorage("theme");
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  return (theme as "light" | "dark" | null) ?? (prefersDark ? "dark" : "light");
}

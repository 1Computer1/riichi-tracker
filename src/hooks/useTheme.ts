import useLocalStorage from "./useLocalStorage";

export function useTheme(): "dark" | "light" {
  const [theme] = useLocalStorage("theme");
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  return (theme as "light" | "dark" | null) ?? (mq.matches ? "dark" : "light");
}

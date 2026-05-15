import type { TileCode } from "./hand";

export function svgForTile(tile: TileCode): readonly [string, string] {
  const base = import.meta.env.BASE_URL;
  const t = (name: string) =>
    [
      `${base}tiles/light/${name}.svg`,
      `${base}tiles/dark/${name}.svg`,
    ] as const;
  switch (tile) {
    case "1z":
      return t("Ton");
    case "2z":
      return t("Nan");
    case "3z":
      return t("Shaa");
    case "4z":
      return t("Pei");
    case "5z":
      return t("Haku");
    case "6z":
      return t("Hatsu");
    case "7z":
      return t("Chun");
    default: {
      const suit = tile[1] === "m" ? "Man" : tile[1] === "p" ? "Pin" : "Sou";
      const num = tile[0] === "0" ? "5-Dora" : tile[0];
      return t(suit + num);
    }
  }
}

export function shortForTile(
  tile: TileCode,
): [string, string, "base" | "blue" | "green" | "red"] {
  switch (tile) {
    case "1z":
      return ["東", "E", "blue"];
    case "2z":
      return ["南", "S", "blue"];
    case "3z":
      return ["西", "W", "blue"];
    case "4z":
      return ["北", "N", "blue"];
    case "5z":
      return [" ", "Wh", "base"];
    case "6z":
      return ["發", "G", "green"];
    case "7z":
      return ["中", "R", "red"];
    default: {
      const suit = tile[1] === "m" ? "red" : tile[1] === "p" ? "blue" : "green";
      const num = tile[0] === "0" ? "5" : tile[0];
      return [num, num, suit];
    }
  }
}

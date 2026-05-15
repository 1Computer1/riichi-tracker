import { createContext, useContext } from "react";

import { type IRepository } from "../data/interfaces";

export const DbContext = createContext<IRepository | null>(null);

export function useDb() {
  return useContext(DbContext)!;
}

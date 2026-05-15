import * as dexie from "./dexie/db";
import { type RepositoryProvider } from "./interfaces";

export const dexieRepository: RepositoryProvider = () => dexie.repository;

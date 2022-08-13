import * as dexie from './dexie/db';
import { RepositoryProvider } from './interfaces';

export const dexieRepository: RepositoryProvider = () => dexie.repository;

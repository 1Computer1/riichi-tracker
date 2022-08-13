import { createContext, ReactNode, useContext } from 'react';
import { IRepository, RepositoryProvider } from '../data/interfaces';

export const DbContext = createContext<IRepository | null>(null);

export function useDb() {
	return useContext(DbContext)!;
}

export default function DbProvider({ children, repository }: { children?: ReactNode; repository: RepositoryProvider }) {
	return <DbContext.Provider value={repository()}>{children}</DbContext.Provider>;
}

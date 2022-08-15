import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { dexieRepository } from './data/db';
import Calculator from './pages/Calculator';
import Compass from './pages/Compass';
import Home from './pages/Home';
import DbProvider from './providers/DbProvider';

import './index.css';

enableMapSet();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<DbProvider repository={dexieRepository}>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/calculator" element={<Calculator />}></Route>
					<Route path="/compass" element={<Compass />}></Route>
				</Routes>
			</HashRouter>
		</DbProvider>
	</React.StrictMode>,
);

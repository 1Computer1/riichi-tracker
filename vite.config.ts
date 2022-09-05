import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
// eslint-disable-next-line arrow-body-style
export default ({ mode }: { mode: string }) => {
	return defineConfig({
		base: process.env.GITHUB_PAGES ? '/riichi-tracker/' : '/',
		build: {
			rollupOptions: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
					if (id.includes('src/assets/tiles/dark')) {
						return 'tiles-dark';
					}
					if (id.includes('src/assets/tiles/light')) {
						return 'tiles-light';
					}
				},
			},
		},
		plugins: [
			react(),
			svgr({
				svgrOptions: {
					svgo: false,
				},
			}),
			VitePWA({
				injectRegister: 'auto',
				registerType: 'autoUpdate',
				includeAssets: ['Chun.svg', 'Chun192.png', 'Chun512.png'],
				devOptions: {
					enabled: mode === 'development',
				},
				manifest: {
					name: 'Riichi Tracker',
					short_name: 'Riichi Tracker',
					start_url: process.env.GITHUB_PAGES ? '/riichi-tracker/' : '/',
					display: 'standalone',
					background_color: '#ffffff',
					lang: 'en',
					scope: '/',
					description: 'Riichi Mahjong Game Tracker',
					theme_color: '#6b7280',
					icons: [
						{ src: 'Chun192.png', sizes: '192x192', type: 'image/png' },
						{ src: 'Chun512.png', sizes: '512x512', type: 'image/png' },
					],
				},
			}),
		],
	});
};

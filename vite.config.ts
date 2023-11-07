import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
// eslint-disable-next-line arrow-body-style
export default ({ mode }: { mode: string }) => {
	return defineConfig({
		base: '/',
		plugins: [
			react(),
			VitePWA({
				injectRegister: 'auto',
				registerType: 'autoUpdate',
				includeAssets: ['Chun.svg', 'Chun192.png', 'Chun512.png', '**/*.svg'],
				devOptions: {
					enabled: mode === 'development',
				},
				manifest: {
					name: 'Riichi Tracker',
					short_name: 'Riichi Tracker',
					start_url: '/',
					display: 'standalone',
					background_color: '#111827',
					lang: 'en',
					scope: '/',
					description: 'Riichi Mahjong Game Tracker',
					theme_color: '#111827',
					icons: [
						{ src: 'riichi192.png', sizes: '192x192', type: 'image/png' },
						{ src: 'riichi512.png', sizes: '512x512', type: 'image/png' },
					],
				},
			}),
		],
	});
};

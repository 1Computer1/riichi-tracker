import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
// eslint-disable-next-line arrow-body-style
export default ({ mode }: { mode: string }) => {
	return defineConfig({
		base: process.env.GITHUB_PAGES ? '/riichi-tracker/' : '/',
		plugins: [
			react(),
			VitePWA({
				injectRegister: 'auto',
				registerType: 'autoUpdate',
				includeAssets: ['Chun.svg', 'Chun192.png', 'Chun512.png'],
				devOptions: {
					enabled: mode === 'development',
				},
				manifest: false,
			}),
		],
	});
};

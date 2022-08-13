import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) =>
	defineConfig({
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

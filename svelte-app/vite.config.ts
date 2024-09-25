import { svelte } from '@sveltejs/vite-plugin-svelte'
import { build } from 'vite';

export default {
	plugins: [svelte()],
	server: {
		port: 3003,
		host: true,
		strictPort: true,
		hmr: {
			protocol: 'ws',
			clientPort: 3003
		}
	},
	build:{
		outDir: 'dist/svelte/selecting-cars'
	},
	base: '/svelte/selecting-cars'
};

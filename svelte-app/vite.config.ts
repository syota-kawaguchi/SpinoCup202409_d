import { svelte } from '@sveltejs/vite-plugin-svelte'

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
	base: '/svelte/selecting-cars'
};

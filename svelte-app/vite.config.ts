import { sveltekit } from '@sveltejs/kit/vite';

export default {
	plugins: [sveltekit()],
	server: {
		port: 3003,
		host: true,
		strictPort: true,
		hmr: {
			protocol: 'ws',
			clientPort: 3003
		}
	},
	base: '/svelte'
};

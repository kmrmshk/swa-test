<script lang="ts">
	import Axios from 'axios';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { signOut, initializeAuth } from '$lib/services/auth';
	import { initStartWatchingStorage } from '$lib/stores/user';
	import has from 'lodash/has';

	import { GoogleAnalytics } from '$lib/components/Analytics';
	import Snackbar from '$lib/components/Snackbar';
    import { Container } from '$lib/components/Modal';
	import theme, { dark, THEME_DARK } from '$lib/stores/theme';

	import 'virtual:windi.css';
	import 'swiper/css';
	import 'swiper/css/grid';
	import '@vime/core/themes/default.css';
	import '$lib/styles/global.scss';
	import '$lib/styles/scroll.css';
	import '$lib/styles/font.css';

	const errorTimeout = 10000;
	const noticeTimeout = 3000;

	let snackbar:Snackbar;

	function traceVersion() {
		console.log(
			`%c fingger %c ${import.meta.env.client_version} `,
			`padding:4px 6px; color:#FFF; background-color:#A133B7; font-size:100%;`,
			`padding:4px 6px; color:#FFF; background-color:#06A3B4; font-size:100%;`,
		);
		console.log(
			'%c CAUTION %cOPERATIONS USING THE DEVELOPER TOOLS ARE NOT SUPPORTED ',
			'padding:4px 6px; border:1px solid #D33929; color:white; background-color: #D33929; font-size:80%;',
			'padding:4px 6px; border:1px solid #D33929; color:#D33929; background-color: white; font-size:80%;',
		);
		// HACK: SPでも簡易確認できるように
		window['v'] = () => alert(`${ import.meta.env.client_version }`);
	}

	function onAxiosError({ detail }) {
		snackbar?.push( detail.message, errorTimeout);

		// NOTE: BANユーザを特定したときは強制ログアウト
		if(detail?.code === 'UserSuspendedFinggerException') {
			signOut();
		}
	}

	function onReceivedNotice(e) {
		const data = e.detail || {
			time: noticeTimeout,
			message: '',
		};
		const timeout = data.time || noticeTimeout;
		if( data.message !== null ){
			snackbar?.push( data.message, timeout);
		}
	}

    function updateHTML() {
        const html = document?.querySelector('html');
        if (html) {
            $dark
                ? html.classList.add(THEME_DARK)
                : html.classList.remove(THEME_DARK);
        }
    }

	onMount(() => {
		if (!browser) {
			return;
		}

		traceVersion();
		initializeAuth();
		initStartWatchingStorage();

		// NOTE: Before pass response, validate errors, and extract result data.
		Axios.interceptors.response.use(undefined, error => {
			const { data = null } = error;
			if(data && has(data, '0.code') && has(data, '0.message')) {
				browser && window.dispatchEvent(
					new CustomEvent('axios-error', { detail: data[0] })
				);
			}
			return error;
		});

		// FIXME: To be removed after v0.38.0 is released
		// NOTE: Migration from old-version
		[
			'fi-uuid',
			'fi-gl-id',
			'fi-gl-access',
			'fi-gl-refresh',
			'fi-app-id',
			'fi-app-epoch',
			'fi-app-terms',
			'fi-theme',
			'fi-sidebar',
		].forEach((k) => localStorage?.removeItem(k));
	});

    $: if(browser && $theme) {
        updateHTML();
    }
</script>

<!-- NOTE: global error handling for snackbar components -->
<svelte:window
	on:axios-error={onAxiosError}
	on:notice={onReceivedNotice}
/>

<GoogleAnalytics />
<slot />
<!-- NOTE: スクロールのスタイルを反映させるために app-container クラスを付与 -->
<Container class="app-container" />
<Snackbar bind:this={snackbar} bottom center fixed />
<script lang="ts">
	import { prepared } from '$lib/stores/user';
	import { NotificationsApi } from '$lib/apis';
	import { userNotifications, generalNotifications } from '$lib/stores/notifications';
	import { onMount } from 'svelte';

	onMount(async () => {
		// NOTE: mount時に全体お知らせ取得
		fetchGeneralNotifications();
	});

	// NOTE: ログイン済みユーザ（お知らせ画面表示後にログインしたユーザ含む）として検出したら個別お知らせ取得
	$: if($prepared) {
		fetchUserNotifications();
	}

	function fetchGeneralNotifications() {
		NotificationsApi
            .getApiV1NotificationsGeneral({})
            .then(data => {
                if (!data) {
                    return;
                }
                generalNotifications.set(data);
            })
			.catch(console.error);
	}

	function fetchUserNotifications() {
		NotificationsApi
            .getApiV1NotificationsMe({})
            .then(data => {
                if (!data) {
                    return;
                }
                userNotifications.set(data);
            })
			.catch(console.error);
	}
</script>

<slot />

<style>
	:global(.notifications li + li::before) {
		content: '';
		@apply block absolute top-0 right-0 left-11 md:left-13 h-1px bg-base-dark bg-opacity-10;
	}
	:global(.notifications.dark li + li::before) {
		@apply bg-white bg-opacity-12;
	}
</style>
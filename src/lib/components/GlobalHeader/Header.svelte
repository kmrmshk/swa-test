<script lang="ts">
	import { signOut } from '$lib/services/auth';
	import { fly } from 'svelte/transition';
	import parseISO from 'date-fns/parseISO/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button';
	import TextField from '$lib/components/TextField';
	import Badge from '$lib/components/Badge';
	import LoginModal from '$lib/components/Login';
	import PurchaseCoinModalSet from './PurchaseCoinModalSet.svelte';

	import { browser } from '$app/environment';
	import { sidebar, searchForm } from '$lib/stores/ui';
	import { dark } from '$lib/stores/theme';
	import { termsAgreedAt } from '$lib/stores/user';
	import { UsersApi, TermsApi } from '$lib/apis';
	import { tab } from '$lib/functions/network';
	import { decodeURI, encodeURI, notify, strLength, trigger } from '$lib/functions/util';
	import { coin, thumbnailUrl, prepared, exchangeable, fetchUser } from '$lib/stores/user';
	import { generalNotificationsBadge } from '$lib/stores/notifications';
	import { authorized } from '$lib/services/auth';
	import { onMount, onDestroy } from 'svelte';

	const maxlength = 256;

	let purchaseModal = false;
	let hasUnreadNotice = false;
	let searchWords = decodeURI($page.url.searchParams.get('query') ?? '');
	let promise:Promise<[void, void]>;
	let searchError = false;

	$: if($prepared && browser) {
		fetchAll();
		checkUpdatingTerms();
	}

	$: searchError = strLength(searchWords) > maxlength;

	function fetchNotificationBadge() {
		return UsersApi
			.getApiV1UsersMeBadges({})
			.then(res => {
				hasUnreadNotice = res?.notification ?? false;
			})
			.catch(console.error);
	}

	function fetchAll() {
		promise = Promise.all([
			fetchUser(),
			fetchNotificationBadge(),
		]);
	}

	function checkUpdatingTerms() {
		// 利用規約の更新チェック
		return TermsApi
			.getApiV1TermsLatestVersion()
			.then(data => {
				const updatedAt = parseISO(data.updatedAt).getTime();
				if($termsAgreedAt > updatedAt) {
					return;
				}
				// NOTE: 利用規約が更新されたら同意した日付をリセット
				$termsAgreedAt = 0;
				if($prepared) {
					signOut();
					notify('利用規約が更新されました。再ログインが必要です。')
				}
			})
			.catch(console.error);
	}

	function onClickedMenu() {
		sidebar.set(Number(!$sidebar));
	}

	function onClickedOpenSearchForm() {
		searchForm.update(_ => true);
	}

	function onClickedCloseSearchForm() {
		searchForm.update(_ => false);
	}

	function onKeyPress(e) {
		if (searchWords.length && e.charCode === 13) {
			// NOTE: ピリオド（.）はURL的にそのままではつかえないので全角に変換してごまかす
			goto(`/search/?q=${ encodeURI(searchWords.replace(/\./g, '．')) }`);
		}
	}

	function onClickedLogo(e) {
		if($page.url.pathname === '/') {
			e.preventDefault();
			e.stopPropagation();
			trigger('refresh');
		}
	}

	function onUpdatedUser() {
		fetchAll();
		tab?.postMessage('updated');
	}

	function onReceivedTab(o) {
		if(tab?.id === o.from) {
			return;
		}
		fetchAll();
	}

	onMount(() => {
		tab?.on('updated', onReceivedTab);
	});

	onDestroy(() => {
		tab?.off('updated', onReceivedTab);
	});
</script>

<!-- コイン消費が発生したときはユーザ情報を更新する -->
<svelte:window on:user-update={ onUpdatedUser } />

<header
	class="{$$props.class || ''} z-5 w-full mx-auto h-14 top-0 left-0 bg-white border-b border-base-dark border-opacity-10 dark:(bg-gray-800 border-white border-opacity-10)">
	<nav class="flex relative justify-between items-center md:px-3 h-full">
		<!--通常状態-->
		<div class="flex flex-row items-center">
			<!--ハンバーガーアイコン-->
			<Button nogutters plain rounded="full"
				class="inline-flex focus:outline-none items-center justify-center w-12 h-12 mr-1"
				on:click={onClickedMenu}>
				<i class="icon text-2xl" class:fingger-menu-collapse={$sidebar} class:fingger-menu={!$sidebar}></i>
			</Button>
			<!--Finggerアイコン-->
			<a class="inline-block align-middle" href="/" on:click={ onClickedLogo }>
				<img class="md:hidden" src="/assets/images/icons/beta/logo-s.svg" alt="Fingger" width="48" height="48">
				<img class="hidden md:inline-block" src="/assets/images/icons/beta/logo-l{$dark ? '@dark' : ''}.svg" alt="Fingger" width="100" height="40">
			</a>
			<!-- NOTE: 検索窓は解像度に応じてのみ表示を可変させる -->
			<Button on:click={ onClickedOpenSearchForm } nogutters plain rounded="full"
				class="inline-flex md:hidden focus:outline-none items-center justify-center w-12 h-12 mr-1">
				<i class="icon text-2xl fingger-search"></i>
			</Button>
		</div>

		<!-- NOTE: 検索窓は解像度に応じてのみ表示を可変させる -->
		{#if $searchForm }
			<!-- 検索バー -->
			<div
				class="flex md:hidden pl-4 py-3 pr-16 absolute top-0 left-0 w-full max-h-full items-center justify-between z-5 bg-white dark:bg-gray-800"
				transition:fly={{duration:250, y:-60}}>
				<TextField class="max-w-full" placeholder="検索" icon="search" block fill on:keypress={onKeyPress}
					maxlength={ maxlength + 1 } error={ searchError }
					bind:value={searchWords}/>
				<Button on:click={ onClickedCloseSearchForm } plain absolute nogutters
					class="inline-flex rounded-full top-1 right-2 w-12 h-12 items-center justify-center">
					<i class="icon fingger-close text-xl"></i>
				</Button>
			</div>
		{:else}
			<div class="hidden md:flex flex-row flex-grow items-stretch pl-10 xl:pl-28 pr-4">
				<TextField class="max-w-md" placeholder="検索" icon="search" block fill on:keypress={onKeyPress}
					maxlength={ maxlength +1 } error={ searchError }
					bind:value={searchWords}/>
			</div>
		{/if}

		<div class="flex flex-row items-center">
			{#if $authorized}
				<!--finggerコイン-->
				<Button on:click={() => purchaseModal = true} nogutters plain rounded="full"
					class="inline-flex px-4 focus:outline-none items-center justify-start h-12 mr-2 md:mr-3">
					<img class="md:mr-4" src="/assets/images/icons/coin.svg" width="28" height="28" alt="coin"/>
					{#await promise}
						<span class="hidden md:inline-block text-base font-light opacity-60">{ $coin }</span>
					{:then res }
						<span class="hidden md:inline-block text-base font-light">{ $coin }</span>
					{/await}
				</Button>
				<PurchaseCoinModalSet bind:active={purchaseModal}/>
			{/if}

			<!--ゲーム-->
			<Button to="/games" nogutters plain rounded="full"
				class="inline-flex focus:outline-none items-center justify-center w-12 h-12 mr-1 xl:mr-4">
				<i class="icon text-2xl fingger-gamepad"></i>
			</Button>

			<!--お知らせ-->
			<Button to="/notifications" nogutters plain rounded="full"
				class="relative inline-flex focus:outline-none items-center justify-center w-12 h-12 mr-1 xl:mr-4">
				<i class="icon text-2xl fingger-alert"></i>
				{#if (hasUnreadNotice && $prepared) || $generalNotificationsBadge }
					<Badge class="-top-1.5 -right-1.5"/>
				{/if}
			</Button>

			{#if $authorized}
				<div>
					<!--アバター-->
					<Button to="/my" nogutters plain rounded="full" class="inline-flex items-center justify-center w-12 h-12 mr-1">
						{#if $thumbnailUrl}
							<img src="{$thumbnailUrl}" class="rounded-14px" width="32" height="32" alt="avatar"/>
						{:else}
							<img src="/assets/images/icons/avatar.svg" class="rounded-14px" width="32" height="32"
								alt="avatar"/>
						{/if}
					</Button>
					{#if $exchangeable}
						<img
							class="absolute top-0.5 right-1 w-5 h-5 md:(top-1 right-3 w-6 h-6) pointer-events-none"
							src="/assets/images/icons/icon-gem.svg"
							alt="diamond"
						/>
					{/if}
				</div>
			{:else}
				<div class="pr-4 sm:pr-5">
					<LoginModal />
				</div>
			{/if}
		</div>
	</nav>
</header>

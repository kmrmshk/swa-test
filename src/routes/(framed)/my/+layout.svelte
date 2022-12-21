<script lang="ts">
	import { derived } from 'svelte/store';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { AccordionItem, Accordion } from '$lib/components/Accordion';

	import Menu, { MenuItem } from '$lib/components/Menu';

	import Avatar from '$lib/components/Avatar';
	import Button from '$lib/components/Button';
	import Modal from '$lib/components/Modal';
	import Checkbox from '$lib/components/Checkbox';
	import tooltip from '$lib/actions/tooltipTrigger';

	import { signOut } from '$lib/services/auth';

	import { thumbnailUrl, channel, exchangeable, asManager, asMember, activated } from '$lib/stores/user';
	import { mobile } from '$lib/stores/device';
	import theme, { THEME_DARK, THEME_LIGHT, dark, light } from '$lib/stores/theme';
	import ActivateModalSet from '$lib/components/ActivateModalSet';
	import { smaller } from '$lib/stores/breakpoint';
	import { authorized } from '$lib/services/auth';

	const roleMap = {
		common      : 0x01,
		distributor : 0x02,
		member      : 0x04,
		organizer   : 0x08,
	};

	let scrollContainer:HTMLElement;
	let activateModal = false;
	let small = derived([smaller('sm'), smaller('xs', true)], ([h, v]) => h || v);
	let role = roleMap.common;

	$: role = roleMap.common |
		($asManager ? roleMap.organizer : 0) |
		($asMember ? roleMap.member : 0) |
		($activated ? roleMap.distributor : 0);

	$: subpages = [
		{
			title: 'アイテム',
			href: '/my/items',
			pattern: /\(framed\)\/my\/?((items)?)$/,
			badge: false,
			role: roleMap.common | roleMap.distributor | roleMap.member | roleMap.organizer,
		},
		{
			title: 'サポートランキング',
			href: '/my/item-rankings',
			pattern: /\(framed\)\/my\/item\-rankings.*$/,
			badge: false,
			role: roleMap.distributor,
		},
		{
			title: 'プレイデータ',
			href: '/my/statistics',
			pattern: /\(framed\)\/my\/statistics.*$/,
			badge: false,
			role: roleMap.distributor,
		},
		{
			title: '履歴',
			href: '/my/histories',
			pattern: /\(framed\)\/my\/histories.*$/,
			badge: false,
			role: roleMap.common,
		},
		{
			title: '動画管理',
			href: '/my/distributions',
			pattern: /\(framed\)\/my\/distributions.*$/,
			badge: false,
			role: roleMap.distributor,
		},
		{
			title: 'ダイヤ',
			href: '/my/diamond',
			pattern: /\(framed\)\/my\/diamond.*$/,
			badge: $exchangeable,
			role: roleMap.distributor | roleMap.member | roleMap.organizer,
		},
		{
			title: '管理アカウント',
			href: '/my/organization',
			pattern: /\(framed\)\/my\/organization.*$/,
			badge: false,
			role: roleMap.organizer,
		},
	];

	$: currentPage = subpages.find(p => p.pattern.test($page.route.id ?? ''));

	$: if (!$authorized) {
		browser && goto('/');
	}

	$: if (!((currentPage?.role ?? roleMap.common) & role)){
		browser && goto('/my');
	}

	afterNavigate(() => {
		scrollContainer.scrollTop = 0;
	});
</script>

<div class="flex flex-col absolute top-0 bottom-0 w-full">
	<header class="flex-shrink-0 bg-white dark:bg-gray-800">
		<div class="flex items-start p-4 md:(px-6 pt-6 pb-4)">
			<Avatar thumbnail={$thumbnailUrl} rounded="2.5xl" class="flex-grow-0 flex-shrink-0 w-12 h-12 sm:vmd:(w-20 h-20)" size={false} />
			<div class="flex-grow mx-4">
				<h4 class="fi-text fi-lb text-left line-clamp-2 text-base sm:vmd:(text-2xl mt-3)">{$channel.title}</h4>
				<div class="flex flex-row gap-3">
					{#if $activated}
						<i use:tooltip={{
							label: '配信アクティベート済み',
							position: 'right',
							offset: { x: 5 }
						}}
						class="icon text-2xl fingger-camera"></i>
					{/if}
					{#if $asManager}
						<i use:tooltip={{
							label: '組織アカウント',
							position: 'right',
							offset: { x: 5 }
						}}
						class="icon text-2xl fingger-building"></i>
					{/if}
				</div>
			</div>

			{#if $small}
				<Modal fill class="md:(w-640px max-h-full)">
					<!-- modal trigger -->
					<Button slot="trigger" let:open on:click={open} nogutters plain rounded="full"
						class="inline-flex focus:outline-none flex-shrink-0 items-center justify-center w-7 h-7 md:(w-12 h-12) mr-1 xl:mr-4">
						<i class="icon text-2xl fingger-more"></i>
					</Button>

					<!-- modal content -->
					<h3 class="px-4 py-4">設定</h3>
					<hr class="border-t-1 border-base-dark border-opacity-10"/>
					<MenuItem on:click={ signOut } class="px-4 h-14">
						<i slot="icon" class="icon fingger-logout"></i>
						ログアウト
					</MenuItem>
					<hr class="border-t-1 border-base-dark border-opacity-10"/>
					<Accordion>
						<AccordionItem let:expanded>
							<!-- Accordion title -->
							<MenuItem slot="title" navi class="px-4 h-14">
								<i slot="icon" class="icon fingger-moon"></i>
								テーマ:{$dark ? 'ダーク' : $light ? 'ライト' : ''}
								<i slot="navi"
									class="icon fingger-arrow-right transition duration-250 transform origin-center {expanded ? '-rotate-90' : 'rotate-90'}"/>
							</MenuItem>
							<!-- Accordion content -->
							<hr class="border-t-1 border-base-dark border-opacity-10"/>
							<MenuItem navi on:click={ () => theme.save(THEME_LIGHT) } class="px-4 h-14">
								ライトテーマ
								<Checkbox slot="navi" checked={$light} disabled={$light}/>
							</MenuItem>
							<MenuItem navi on:click={ () => theme.save(THEME_DARK) } class="px-4 h-14">
								ダークテーマ
								<Checkbox slot="navi" checked={$dark} disabled={$dark}/>
							</MenuItem>
						</AccordionItem>
					</Accordion>
					<hr class="border-t-1 border-base-dark border-opacity-10"/>
					{#if !$activated}
						<!-- NOTE: CTA計測用セレクタとして cta-activate-dist クラスをセットしています -->
						<MenuItem on:click={ ()=>{activateModal=true;} } class="cta-activate-dist px-4 h-14">
							<i slot="icon" class="icon fingger-camera"></i>
							配信アクティベート
						</MenuItem>
						<hr class="border-t-1 border-base-dark border-opacity-10"/>
					{/if}
				</Modal>
			{:else}
				<Menu right>
					<div slot="trigger">
						<Button nogutters plain rounded="full"
							class="inline-flex focus:outline-none items-center justify-center w-12 h-12 mr-1 xl:mr-4">
							<i class="icon text-2xl fingger-more"></i>
						</Button>
					</div>
					<MenuItem on:click={ signOut } class="pl-6 pr-4">
						<i slot="icon" class="icon fingger-logout"></i>
						ログアウト
					</MenuItem>
					<Menu top right>
						<div slot="trigger">
							<MenuItem navi lg class="pl-6 pr-4">
								<i slot="icon" class="icon fingger-moon"></i>
								テーマ:{$dark ? 'ダーク' : $light ? 'ライト' : ''}
							</MenuItem>
						</div>
						<MenuItem on:click={ () => theme.save(THEME_LIGHT) } class="pl-6 pr-4">
							<Checkbox slot="icon" checked={ $light } disabled={ $light }/>
							ライトテーマ
						</MenuItem>
						<MenuItem on:click={ () => theme.save(THEME_DARK) } class="pl-6 pr-4">
							<Checkbox slot="icon" checked={ $dark } disabled={ $dark }/>
							ダークテーマ
						</MenuItem>
					</Menu>
					{#if !$activated}
					<!-- NOTE: CTA計測用セレクタとして cta-activate-dist クラスをセットしています -->
					<MenuItem on:click={ ()=>{activateModal=true;} } class="cta-activate-dist pl-6 pr-4">
						<i slot="icon" class="icon fingger-camera"></i>
						配信アクティベート
					</MenuItem>
					{/if}
				</Menu>
			{/if}
		</div>

		<Tabs value={$page.route.id} class="md:ml-6" swipe={$small}>
			{#key $activated}
				<TabNav shrink={false}>
					{#each subpages as item}
						{#if item.role & role }
							<TabNavItem
								path={ item.pattern }
								on:click={ () => { browser && goto(item.href) } }
							>
								<span class="line-clamp-1">{item.title}</span>
								{#if item.badge}
									<img
										class="absolute top-0 { $mobile ? 'right-0.5 w-4.5 h-4.5' : 'top-1 right-3 w-6 h-6' } pointer-events-none"
										src="/assets/images/icons/icon-gem.svg"
										alt="diamond"
									/>
								{/if}
							</TabNavItem>
						{/if}
					{/each}
				</TabNav>
			{/key}
		</Tabs>

	</header>

	<section class="relative flex-grow overflow-hidden h-10">
		<div bind:this={scrollContainer} class="absolute inset-0 overflow-y-auto">
			<slot/>
		</div>
	</section>
</div>

<ActivateModalSet bind:active={activateModal} />
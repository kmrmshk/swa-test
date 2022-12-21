<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/components/Modal';
	import Button from '$lib/components/Button';
	import { Tabs, TabNav, TabNavItem } from '$lib/components/Tabs';
	import SettingGiftArea from './SettingGiftArea.svelte';
	import SettingTagArea from './SettingTagArea.svelte';
	import SettingUnlistedArea from './SettingUnlistedArea.svelte';
	import { smaller } from '$lib/stores/breakpoint';
	import { mobile } from '$lib/stores/device';

	const small = smaller('sm');
	$: isFillTarget = $mobile || $small;

	export let active = false;
	export let distribution = {};
	export let isStream = false;
	export let allTags =[];

	let isGiftEnable = false;
	let isGiftEffectEnable = false;
	let unlisted = false;
	let selectedTags = [];
	let changed = false;
	let confirmModal = false;

	const dispatch = createEventDispatcher();

	let currentTabIndex = isStream ? 0 : 1;

	const tabIndexGift = 0;
	const tabIndexTag = 1;
	const tabIndexOther = 2;
	const tabpages = [
		{
			title: 'ギフト',
			active: isStream
		},
		{
			title: '配信タグ',
			active: true
		},
		{
			title: 'その他',
			active: true
		},
	];

	$: if(distribution){
		reset();
	}

	function reset(){
		isGiftEnable = distribution.isGiftEnable;
		isGiftEffectEnable = distribution.isGiftEffectEnable;
		unlisted = distribution.unlisted;
		selectedTags = [ ...distribution.tags ?? [] ];
	}

	function close(){
		if( !changed ){
			return;
		}
		active = true;
		confirmModal = true;
	}

	function onClickedAbortProcess() {
		reset();
		active =
		confirmModal = false;
	}

	function onClickedAccept(){
		distribution.isGiftEnable = isGiftEnable;
		distribution.isGiftEffectEnable = isGiftEffectEnable;
		distribution.unlisted = unlisted;
		distribution.tags = selectedTags;
		active = false;
		dispatch('accept');
	}

	function onClickedDissolveButton(){
		dispatch('click-dissolve',{
			uuid : distribution.uuid
		});
	}

	$: if( selectedTags?.length && unlisted != undefined && isGiftEnable != undefined && isGiftEffectEnable != undefined ){
		changed = compareDifference();
	}

	function compareDifference(){
		if( distribution.unlisted != unlisted
			|| distribution.isGiftEnable != isGiftEnable
			|| distribution.isGiftEffectEnable != isGiftEffectEnable
			|| distribution.tags.length != selectedTags.length ){
			return true;
		}
		return distribution.tags.some( (tag,i) => tag.id != selectedTags[i].id );
	}
</script>

<Modal bind:active={ active } on:close={ close } fill class="w-180  h-full max-h-full {isFillTarget ? '' : 'min-h-120 max-h-180'}">
	<div class="absolute inset-0 flex flex-col w-full h-full overflow-hidden">
		<h4 class="relative justify-center flex-shrink-0 w-full pt-4 pb-3 text-sm text-center md:(pt-8 pb-5 text-2xl) border-b-1 border-base-dark border-opacity-10">
			<slot name="header">配信設定</slot>
		</h4>
		<div class="pt-5 md:pt-12 flex-1 overflow-y-auto flex justify-center">
			<div class="w-full pb-5">
				<p class="pb-8 md:px-6 px-3">
					「{distribution.title}」の配信設定を編集します
				</p>
				<div class="fi-border border-b mb-5">
					<Tabs bind:value={ currentTabIndex } class="md:ml-6">
						<TabNav shrink={false}>
							{#each tabpages as item, index}
								{#if item.active }
									<TabNavItem
										value={ index }
									>
										{item.title}
									</TabNavItem>
								{/if}
							{/each}
						</TabNav>
					</Tabs>
				</div>
				<div class="overflow-x-hidden">
					{#if currentTabIndex == tabIndexGift}
						<SettingGiftArea gameGiftEnable={distribution?.gameGiftEnable} bind:isGiftEnable={isGiftEnable} bind:isGiftEffectEnable={isGiftEffectEnable} />
					{:else if currentTabIndex == tabIndexTag}
						<SettingTagArea bundleId={isStream ? distribution.bundleId : ''} {distribution} bind:selectedTags={selectedTags} {allTags} />
					{:else if currentTabIndex == tabIndexOther}
						<SettingUnlistedArea bind:unlisted={unlisted} />
						{#if isStream}
						<div class="{$$props.class || ''}">
							<div class="py-3 px-3 md:px-6">
								配信設定
							</div>
							<hr>
							<div class="py-3 px-3 md:px-6 flex items-center justify-center">
								<div class="text-sm flex-grow">
									<span class="font-bold mr-2">配信連携</span>
								</div>
								<Button on:click={()=>onClickedDissolveButton()} text outlined>解除</Button>
							</div>
							<hr>
						</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
		<div class="flex justify-center pt-7 pb-8 border-t-1 border-base-dark border-opacity-10">
			<Button disabled={ !changed || ! selectedTags.length } on:click={ onClickedAccept }>保存</Button>
		</div>
	</div>
</Modal>

<Modal
	class="w-70 rounded-lg"
	bind:active={ confirmModal }
	closeable={ false }
	cancelable
	acceptable
	on:cancel={ () => confirmModal = false }
	on:accept={ onClickedAbortProcess }
>
	<p class="p-6 text-sm">設定変更は反映されませんが終了してよろしいですか？</p>
	<span slot="cancel" class="text-base">キャンセル</span>
	<span slot="accept" class="text-base">OK</span>
</Modal>
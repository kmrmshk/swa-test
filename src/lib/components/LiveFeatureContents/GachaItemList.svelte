<script lang="ts">
	import Carousel from '$lib/components/Carousel';
	import Modal from '$lib/components/Modal';
	import Avatar from '$lib/components/Avatar';
	import TextField from '$lib/components/TextField';
	import Button from '$lib/components/Button';
	import Radio from '$lib/components/Radio';

	import { desktop, mobile } from '$lib/stores/device';
	import { smaller } from '$lib/stores/breakpoint';
	import { dark } from '$lib/stores/theme';
	import nth from 'lodash/nth';
	import get from 'lodash/get';
	import pick from 'lodash/pick';
	import isEmpty from 'lodash/isEmpty';
	import throttle from 'lodash/throttle';

	import { prepared } from '$lib/stores/user';
	import { items } from '$lib/stores/distributions';
	import { DistributionsApi, UsersApi } from '$lib/apis';
	import GachaItemCard from './GachaItemCard.svelte';
	import { strLength, trigger } from '$lib/functions/util';

	import type {
		FinggerPlatform_Server_Shared_DataTransferObjects_Item_ItemGroupedPublic as ItemGrouped,
		FinggerPlatform_Server_Shared_DataTransferObjects_Product_ProductAbilityPublic as ProductAbility
	} from '$lib/apis';

	const small = smaller('sm');
	const maxlength = 200;

	const itemSlidesPerColumn = 2;
	const itemBreakpoints = {
		600: { slidesPerView: 1, slidesPerGroup: 1, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
		960: { slidesPerView: 2, slidesPerGroup: 2, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
		1136: { slidesPerView: 3, slidesPerGroup: 3, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
		1336: { slidesPerView: 4, slidesPerGroup: 4, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
		1536: { slidesPerView: 5, slidesPerGroup: 5, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
		1920: { slidesPerView: 6, slidesPerGroup: 6, grid:{ rows: itemSlidesPerColumn, fill: 'row' } },
	};

	export let streamUuid = '';
	export let bundleId = '';
	export let asCarousel = true;

	let itemDetailModal = false;
	let selectedItem:ItemGrouped = {};
	let itemMessage = '';
	let selectedAbilityIndex = 0;
	let selectedItemKeyword = '';

	$: if (bundleId && $prepared) {
		fetchItems();
	}

	$: errorText = strLength(itemMessage) > maxlength ? '入力文字数が多すぎます。'
			: itemMessage.match(/^\s+$/) ? 'スペースのみでは送信できません。'
			: '';
	$: hasItemAbilities = selectedItem?.productAbilities && selectedItem?.productAbilities.length > 1;
	$: if(!isEmpty(selectedItem)) {
		selectedItemKeyword = selectedItem?.productAbilities[selectedAbilityIndex].keywords[0];
	}

	$: isFillTarget = $mobile || $small;

	function fetchItems() {
		UsersApi
			.getApiV1UsersMeItemsAggregate({ bundleId })
			.then(data => {
				if (!data) {
					return;
				}
				$items = get(data, '0.items', []);
			});
	}

	function toItemName(name = '') {
		if(strLength(name) > 6) {
			return name.replace(/^(.{6}).*$/, '$1…');
		} else {
			return name;
		}
	}

	function onSelectItem(index) {
		selectedItem = nth($items, index) || {};
		selectedAbilityIndex = 0;
		itemMessage = '';
		itemDetailModal = true;
	}

	function onKeypressCommentInput(e) {
		if (itemMessage.length && !errorText.length && e.charCode === 13) {
			onCommitProduct();
		}
	}

	function onCommitProduct() {
		itemDetailModal = false;
		const productId = hasItemAbilities
			? get(selectedItem, `productAbilities.${selectedAbilityIndex}.productAbilityId`)
			: get(selectedItem, 'productId', '');
		const targetKeyword = get(selectedItem, `productAbilities.${selectedAbilityIndex}.keywords.0`);
		const message = `${ targetKeyword } ${ itemMessage }`;
		// NOTE: アイテム数はローカルで減算することで表示更新する
		// ただし、このAPIではまだUuidが確定していないのでデクリメントはできない
		DistributionsApi
			.postApiV1DistributionsCommentsItem({
				uuid: streamUuid,
				productId,
				additionalMessage: itemMessage
			})
			.then(_ => {
				trigger('consumed-item', message);
				//fetchItems();
			})
			.catch(() => {
				trigger('send-error-comment', 'アイテムを使用できませんでした。');
			});
	}
</script>

<svelte:window on:gameitem-update={ fetchItems } />

{#if asCarousel}
	<Carousel
		list={ $items }
		slidesPerColumn={ itemSlidesPerColumn }
		breakpoints={ itemBreakpoints }
		useDummy={ true }
	>
		<div slot="slide" let:item let:index class="px-2 pb-2">
			<GachaItemCard
				on:click={() => onSelectItem(index)}
				thumbnail={ item?.thumbnailUrl ?? '' }
				asEmpty={ !item }
				{ ...pick(item, ['name', 'amount']) }
			/>
		</div>
	</Carousel>
{:else}
	<div class="grid gap-4 grid-cols-2 {$desktop ? 'lg:grid-cols-3 xl:grid-cols-4' : ''}">
		{#each $items as item, index}
			<GachaItemCard
				on:click={() => onSelectItem(index)}
				thumbnail={ item.thumbnailUrl ?? '' }
				{ ...pick(item, ['name', 'amount']) }
			/>
		{/each}
	</div>
{/if}

<!-- アイテム詳細モーダル -->
<!-- NOTE: モーダル表示中はブラウザのナビゲーションを無効化 -->
<Modal
	bind:active={itemDetailModal}
	closeWithNavigate={false}
	closeable
	fill
	rounded={hasItemAbilities ? '2xl' : 'lg'}
	class="pb-3 {hasItemAbilities ? 'h-full md:(w-720px max-h-742px)' : 'md:(w-480px)'}"
	innerClass={ !hasItemAbilities && isFillTarget ? 'flex flex-col justify-center' : '' }
>
	<div
		class="flex flex-col content-center top-0 bottom-60px md:bottom-108px w-full overflow-y-auto"
		class:pb-4={ hasItemAbilities }
		class:absolute={ hasItemAbilities }
	>
		<div class="pt-5 px-4 md:(pt-9 px-6) flex flex-col justify-center">
			<Avatar class="mx-auto" rounded="lg" size="64" thumbnail="{ selectedItem?.thumbnailUrl ?? '' }"/>
			<h4 class="mt-3 text-center text-sm font-bold">{ selectedItem.name }</h4>
			<p class="mt-4 text-sm min-h-16">{@html selectedItem.description }</p>
		</div>
		{#if !hasItemAbilities}
			<hr/>
		{/if}
		<div class="flex items-center items-start justify-center self-center flex-grow-0 flex-shrink-0 w-3/5 md:w-1/3 h-13 max-h-13 fi-border">
			<h5 class="flex-shrink-0 flex-grow-0 text-sm text-opacity-60">所持数</h5>
			<div class="fi-text-sub flex-grow text-sm font-bold text-right">{ selectedItem.amount }</div>
			<i class="fi-text-sub mx-2 flex-shrink-0 flex-grow-0 icon fingger-arrow-right text-2xl"></i>
			<div class="fi-text-sub flex-grow text-sm font-bold text-right">{ selectedItem.amount - 1 }</div>
		</div>
		{#if hasItemAbilities}
			<ul class="border-t">
				{#each selectedItem.productAbilities as item, index}
					<li class="flex flex-row items-center px-4 md:px-7 py-3 text-sm max-h-65px border-b"
						class:dark={ $dark }
						class:selected={ selectedAbilityIndex == index }
						on:click={ () => selectedAbilityIndex = index }
					>
						<Radio block class="align-middle" bind:group={ selectedAbilityIndex } value={ index }></Radio>
						<div class="ml-2 md:ml-4 bg-contain w-12 h-12" style={`background-image: url(${ item?.thumbnailUrl ?? '' }`}></div>
						<div class="ml-2 md:ml-6">{ item.description }</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	<div
		class="flex items-center bottom-0 px-4 w-full h-60px bg-white dark:bg-gray-800 { hasItemAbilities ? 'fi-border px-6 border-t' : 'py-2'} { errorText.length ? 'mb-5' : '' }"
		class:absolute={ hasItemAbilities }
	>
		<TextField prefix block fill class="flex-1 min-w-0 fi-text-sub flex-grow" bind:value={ itemMessage } error={ errorText.length } errorText={ errorText } placeholder="コメントを入力" maxlength={ maxlength +1 } on:keypress={onKeypressCommentInput}>
			<span slot="prefix" class="whitespace-nowrap pr-2 text-sm text-left">{ toItemName(selectedItemKeyword) }</span>
		</TextField>
		<Button disabled={ selectedItem.amount < 1 || errorText.length } on:click={ throttle(onCommitProduct, 500, {trailing: false}) } class="ml-2 px-0 md:px-0 min-w-16">
			送る
		</Button>
	</div>
</Modal>

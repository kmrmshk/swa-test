<script lang="ts">
	import type { PageData } from './$types';
	import parseISO from 'date-fns/parseISO/index.js';
	import format from 'date-fns/format/index.js';
	import {
		DistributionsApi,
		UsersApi,
		type FinggerPlatform_Server_Shared_DataTransferObjects_Distribution_DistributionDetailPublic as DistributionDetail
	} from '$lib/apis';
	import { channel, prepared } from '$lib/stores/user';
	import { larger } from '$lib/stores/breakpoint';
	import Metatags from '$lib/components/Metatags';
	import Modal from '$lib/components/Modal';
	import InfiniteScroll from '$lib/components/InfiniteScroll';
	import DistributionManagementList from '$lib/components/DistributionManagementList';
	import { DistributionSettingModal } from '$lib/components/DistributionSettings';

	type DistributionDetailEx = DistributionDetail & {
		date?: string;
		unlisted?: boolean;
	};
	export let data:PageData;

	const { allTags } = data;
	const large = larger('md');
	const limitPerFetch = 10;

	let distributions:Array<DistributionDetailEx> = [];
	let hasDistribution = false;
	let promise = Promise.resolve();
	let scroll:InfiniteScroll;
	let switchModal = false;
	let buttonModal = false;
	let editModal = false;
	let selectedUuid = '';
	let selectedDistribution:DistributionDetailEx = {};

	function getDateFormat(date:string) {
		return format(parseISO(date), 'yyyy/MM/dd HH:mm');
	}

	function fetchDistributions(){
		return UsersApi.getApiV1UsersMeDistributions({
			status: 'Completed',
			limit: limitPerFetch,
			offset: distributions.length
		})
		.then( data => {
			if (!data) {
				return [];
			}
			const list = data.map( item => ({
				...item,
				// NOTE: 配信しないままCompleted扱いとなった場合は予約時間を代わりにセットする
				date: getDateFormat(item.actualStartAt || item.scheduledStartAt || ''),
				unlisted: item.privacyStatus === 'Unlisted'
			}));

			if ( 0 < list.length ) {
				distributions = distributions.concat(list);
				scroll?.validate();
			}
			hasDistribution = 0 < distributions.length;
		})
		.catch(console.error);
	}

	function addToPromise(f) {
		promise = promise.then(() => f());
	}

	function onClickDelete(e){
		if(switchModal) return;
		buttonModal = true;
		selectedUuid = e.detail.uuid;
	}

	async function onClickEdit(e){
		selectedUuid = e.detail.uuid;
		selectedDistribution = distributions.find(obj=>obj.uuid === selectedUuid) ?? {};
		selectedDistribution.tags = await DistributionsApi.getApiV1DistributionsTags({ uuid: selectedUuid });
		buttonModal = false;
		editModal = true;
	}

	function onClickedSettingModalAcceptButton(){
		patchPrivacyStatus();
		patchTags();
	}

	function patchPrivacyStatus(){
		const privacyStatus = selectedDistribution.unlisted ? 'Unlisted':'Public';
		return DistributionsApi.patchApiV1DistributionsPrivacyStatus({
			uuid: selectedUuid,
			privacyStatus
		});
	}

	function patchTags(){
		const tagIds = selectedDistribution.tags?.map( tag => tag.id ?? '' );
		return DistributionsApi.patchApiV1DistributionsTags({
			uuid: selectedUuid,
			requestBody: tagIds
		});
	}

	function onClickedButtonModalAcceptButton(){
		const deleteStatus = 'Disabled';
		return DistributionsApi.patchApiV1DistributionsStatus({
				uuid: selectedUuid,
				status: deleteStatus
			})
			.then(data => {
				if(data){
					const index = distributions.findIndex(obj=>obj.uuid === selectedUuid);
					distributions.splice(index,1);
					distributions = distributions;
					hasDistribution = 0 < distributions.length;
				}
			})
			.catch(console.error);
	}
</script>

<Metatags
	useSuffix
	title="{$channel.title} / 動画"
/>

<ul class="mx-auto mb-12 table table-fixed w-full max-w-800px border-none border-t-1 border-b-1 border-base-dark border-opacity-10 bg-white dark:bg-gray-800 md:(mt-3 mb-6 rounded-lg overflow-hidden border-1 shadow-02dp)">
	<li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-t-1 border-t-1 border-b-1 border-base-dark border-opacity-10 text-sm">
	{#if $large}
			<div class="table-cell align-middle font-bold text-left pl-8 w-46">動画</div>
			<div class="table-cell align-middle font-bold text-left pl-4 w-60"></div>
			<div class="table-cell align-middle font-bold text-left pl-4 w-38">配信開始時刻</div>
			<div class="table-cell align-middle font-bold text-left pl-4 w-24">配信設定</div>
			<div class="table-cell align-middle font-bold text-right pr-8 w-24">動画削除</div>
	{:else}
			<div class="table-cell align-middle pl-6 pr-4">
					<div class="flex font-bold justify-between">
							<span>動画</span>
					</div>
			</div>
	{/if}
	</li>
	{#if hasDistribution}
		<DistributionManagementList
			isStream={false}
			bind:distributions={distributions}
			on:click-delete={onClickDelete}
			on:click-edit={onClickEdit}
		/>
	{:else}
		<li class="table-row px-8 h-13 text-md">
			<td colspan="{ $large ? 5 : 1 }" class="align-middle text-center text-sm">
					情報がありません
			</td>
		</li>
	{/if}
</ul>
<InfiniteScroll
	active={ $prepared }
	bind:this={ scroll }
	on:more={ () => addToPromise(fetchDistributions) }
/>

<!-- 動画削除モーダル -->
<Modal bind:active={ buttonModal } closeable={false} acceptable cancelable
	on:accept={ onClickedButtonModalAcceptButton }
	rounded="lg"
	class="w-90">
	<p class="p-6 text-sm fi-lb-strict">
		対象のfingger配信のアーカイブ動画が削除されます。よろしいですか？
	</p>
	<span slot="accept">
		削除する
	</span>
</Modal>

<DistributionSettingModal bind:active={editModal}
	on:accept={ onClickedSettingModalAcceptButton }
	bind:distribution={selectedDistribution}
	{allTags}
/>

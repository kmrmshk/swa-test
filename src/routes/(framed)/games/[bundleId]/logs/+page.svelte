<script lang="ts">
	import type { PageData } from './$types';
	import axios from 'axios';
	import { prepared, thumbnailUrl, channel, uuid } from '$lib/stores/user';
	import Avatar from '$lib/components/Avatar';
	import Loading from '$lib/components/Loading';
	import { LoginNavigator } from '$lib/components/Login';
	import { RecursivelyDataField } from '$lib/components/ContentsPlayData';
	import { notify } from '$lib/functions/util';
	import Metatags from '$lib/components/Metatags';

	export let data:PageData;
	let promise:Promise<any>;
	let bundleInfo = data.bundleInfo;

	$: if($prepared && bundleInfo?.bundleId) {
		promise = fetchUsersPlaydata();
	}

	function fetchUsersPlaydata() {
		const gameId = bundleInfo.bundleId.split('.').pop();
		// NOTE: gamingapi_endpoint には <gameId> という文字列がセットされており、gameId と置換している
		const endpoint = `${ import.meta.env.gamingapi_endpoint }/users/playdata`;
		return axios.create()
			.get(endpoint.replace('<gameId>', gameId), {
				params: {userId: $uuid}
			})
			.then(res => {
				if(res.status >= 500) {
					notify('ゲームサーバーでエラーが発生しました。');
					return {};
				}
				return res.data;
			})
			.catch(e => {
				console.error(e);
				throw e;
			});
	}
</script>

<Metatags
	useSuffix
	useDescriptionSuffix
	title="{ bundleInfo?.title } | プレイデータ"
	description="{ bundleInfo?.title } | プレイデータ"
/>

{#if $prepared}
	<div class="flex flex-col absolute top-0 bottom-0 w-full">
		<header class="flex-shrink-0 bg-white dark:bg-gray-800">
			<div class="mx-auto flex items-center p-4 md:(px-6 pt-6) w-full max-w-6xl">
				<Avatar thumbnail={$thumbnailUrl} rounded="2.5xl" class="flex-grow-0 flex-shrink-0 h-12 w-12 sm:vmd:(w-20 h-20 rounded-5xl)" size="100%" />
				<div class="mx-4 flex-grow">
					<h4 class="text-lg md:text-2xl text-left line-clamp-2">{ $channel.title }</h4>
				</div>
			</div>
		</header>
		<div class="mx-auto p-4 md:(px-6 pb-6) w-full max-w-6xl">
			{#await promise}
				<div class="mt-4 flex justify-center items-center w-full overflow-hidden pointer-events-none">
					<Loading light="#06A3B4" dark="#7ED9E2" size="32" />
				</div>
			{:then res}
				<!-- プレイデータ -->
				<RecursivelyDataField
					sectionClass="grid gap-x-4 gap-y-2 grid-cols-2 lg:grid-cols-3 w-full"
					data={ res?.data }
				/>
				<!-- 備考欄 -->
				<RecursivelyDataField
					sectionClass="w-full"
					cardClass="mb-4 text-sm fi-text-sub"
					data={ res?.appendix }
				/>
			{:catch _}
				<div class="pt-4 md:pt-10 text-center font-bold text-sm md:text-xl fi-text-sub">
					プレイデータはありません
				</div>
			{/await}
		</div>
	</div>
{:else}
	<LoginNavigator class="px-10 py-10">
		<span class="fi-text">ログインするとプレイデータが確認できるようになります</span>
	</LoginNavigator>
{/if}
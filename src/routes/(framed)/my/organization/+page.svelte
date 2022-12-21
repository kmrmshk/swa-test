<script lang="ts">
	import { goto } from '$app/navigation';
	import { OrganizationsApi } from '$lib/apis';
	import Avatar from '$lib/components/Avatar';
	import Select from '$lib/components/Select';
	import Button from '$lib/components/Button';
	import { smaller } from '$lib/stores/breakpoint';
	import { prepared } from '$lib/stores/user';
	import format from 'date-fns/format/index.js';
	import subMonths from 'date-fns/subMonths/index.js';
	import parseISO from 'date-fns/parseISO/index.js';
	import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths/index.js';
	import range from 'lodash/range';
	import { toApproxNumber } from '$lib/functions/util';

	const sm = smaller('md');

	let createdAt:Date;
	let selectedAt:Date;
	let dateList:any[] = [];

	function fetchMembers() {
		return OrganizationsApi.getApiV1OrganizationsMeMembers()
			.then(data => {
				createdAt = parseISO(data.createdAt ?? '');
				updateMonthsRange();
				return data.members ?? [];
			});
	}

	async function downloadCSV() {
		const date = new Date(selectedAt);
		const month = format(date, 'yyyy-MM');
		const data = await OrganizationsApi.getApiV1OrganizationsMeDiamondHistoryExport({ month });
		let blob = new Blob([data], {type: 'text/csv'});
		let uri = URL.createObjectURL(blob);
		let link = document.createElement('a');
		link.download = `${ format(date, 'yyyyMM') }_${ format(new Date(), 'yyyyMMddHHmmss')}.csv`;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function updateMonthsRange() {
		const currentDate = new Date();
		const diffMonth = differenceInCalendarMonths(currentDate, createdAt) + 1;
		const list = range(0, diffMonth).map(o => {
			const target = subMonths(currentDate, o);
			return new Date(
				target.getUTCFullYear(),
				target.getUTCMonth(),
				1,
			);
		});
		return list.map(item => ({
			name: format(item, 'yyyy年MM月'),
			value: item
		}));
	}

	$: if(createdAt) {
		dateList = updateMonthsRange();
	}
</script>

{#if $prepared}
	{#await fetchMembers() then members}
		<ul class="mx-auto mt-6 mb-12 table table-fixed w-full max-w-712px border-none border-t-1 border-b-1 border-base-dark border-opacity-10 bg-white dark:bg-gray-800 md:(mt-6 mb-6 rounded-lg overflow-hidden border-1 shadow-02dp)">
			<li class="fi-text-sub table-row table-header-group px-8 h-56px bg-gray-300 dark:bg-gray-700 border-t-1 border-b-1 border-base-dark border-opacity-10 text-sm">
				<div class="table-cell align-middle text-left font-bold pl-6 md:pl-8">チャンネル名</div>
			</li>
			<li class="table-row">
				<div class="table-cell">
					{#each members as item}
						<div class="px-6 md:px-8 py-3 md:py-4 flex flex-row justify-start items-center gap-3 md:gap-4">
							<Avatar on:click={ () => goto(`/users/${ item.uuid }`) }
								class="cursor-pointer"
								rounded={$sm ? '2.5xl' : '5xl'}
								size={$sm ? 48 :  80}
								thumbnail={ item.thumbnailUrl ?? '' }>
							</Avatar>
							<div class="flex flex-col gap-1">
								<h3 class="text-sm md:text-xl font-bold">{ item.youTubeChannelTitle }</h3>
								<a href="https://www.youtube.com/channel/{ item.youTubeChannelId }" target="_blank" class="inline-flex justify-start items-center">
									<i class="icon fingger-human-human text-2xl text-base-dark dark:text-base-light"></i>
									<span class="ml-1 text-xs md:text-sm text-base-dark text-opacity-60 dark:(text-base-light text-opacity-60)">
										{#if item?.subscriberCount}
											YouTube登録者数 { toApproxNumber(item.subscriberCount ?? 0, '人') }
										{:else}
											YouTubeチャンネルへ
										{/if}
									</span>
								</a>
							</div>
						</div>
						<hr />
					{/each}
				</div>
			</li>
			<div class="px-6 md:px-8 py-6">
				ダイヤ明細ダウンロード
				<div class="mt-4 flex flex-row justify-start items-center gap-4 max-w-90">
					<Select
						bind:value={ selectedAt }
						class="flex-1 md:h-12"
						list={ dateList }
						placeholder="月を選択"
					/>
					<Button disabled={!selectedAt} plain class="w-10 h-10" on:click={ downloadCSV }>
						<i class="icon fingger-download text-2xl"></i>
					</Button>
				</div>
			</div>
		</ul>
	{/await}
{/if}
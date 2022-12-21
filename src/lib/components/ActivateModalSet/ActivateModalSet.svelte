<script lang="ts" context="module">
	import { goto } from '$app/navigation';
	import { UsersApi } from '$lib/apis';
	import { distributorActivationStatus } from '$lib/stores/user';
	import { trigger } from '$lib/functions/util';

	export async function checkActivated() {
		// 未同意 or 規約改訂 の場合モーダルを開く(true)
		return UsersApi.getApiV1UsersMe()
			.then(data => {
				distributorActivationStatus.set(data.distributorActivationStatus);
				return data.distributorActivationStatus !== 'Enabled';
			})
			.catch(console.error);
	}
</script>
<script lang="ts">
	import Modal from '$lib/components/Modal';
	import Button from '$lib/components/Button';
	import Checkbox from '$lib/components/Checkbox';
	import { beforeNavigate } from '$app/navigation';

	export let active = false;

	const externalTermsUrl = import.meta.env.url_distributor_terms;
	const externalManualUrl = import.meta.env.url_distribution_manual;

	let checked = false;
	let activeComplete = false;
	let activeReAgreeComplete = false;
	let userNotificationUuid = '';

	function onClickedActivate(){
		// アクティベート処理
		return UsersApi.postApiV1UsersMeActivateDistributor()
		.then(data => {
			distributorActivationStatus.set(data.activationStatus ?? null);
			userNotificationUuid = data.userNotificationUuid ?? '';
			if(data.isInitialActivation){
				activeComplete = true;
			}
			else{
				activeReAgreeComplete = true;
			}
			active = false;
			checked = false;
			// NOTE: お知らせバッジ更新
			trigger('user-update');
		})
		.catch(console.error);
	}

	function gotoNotifications() {
		// NOTE:Modalを閉じてからでないと、表示リセットされないバグが発生したため、明示的に閉じる
		activeComplete = false;
		goto("/notifications/inbox/" + userNotificationUuid);
	}

	function reset(){
		active = false;
		checked = false;
	}

	beforeNavigate(() => {
		reset();
	});
</script>

<!-- 配信アクティベート -->
<Modal
	active={active && $distributorActivationStatus === 'Disabled'}
	on:close={reset}
	fill
	let:fillMode
	frameClass="w-160 pb-8"
>
	<div class="flex flex-col w-full h-full" >
		<h4 class="relative justify-center flex-shrink-0 w-full pt-4 pb-3 pl-6 text-sm font-bold { fillMode ? '':'pt-8 pb-5 pl-0 text-2xl font-normal text-center'} border-b-1 border-base-dark border-opacity-10">
			配信アクティベート
		</h4>
		<div class="p-6 leading-relaxed">
			<p>
				finggerで配信をするためには配信アクティベートが必要です。<br>
				配信アクティベートをする場合は、必ず<a href="{ externalTermsUrl }" target="_blank" class="text-teal-600">配信規約</a>をご確認のうえ同意をお願いいたします。<br>
			</p>
			<p class="mt-6">
				配信アクティベートを行うことで、finggerで配信が可能となる他に、以下の機能がご利用いただけます。<br>
			</p>
			<p class="ml-1">
				・「サポートランキング」<br>
				・「プレイデータ確認」<br>
				・「動画管理機能」<br>
				・「ダイヤ」
			</p>
		</div>
		<div class="fi-border w-full border-t-1 border-base-dark border-opacity-10">
			<div class="text-center mt-6">
				<Checkbox bind:checked={checked}>
					<span class="ml-4">配信規約に同意する</span>
				</Checkbox>
			</div>
			<div class="flex flex-wrap justify-center mt-6 { fillMode ? 'pb-18':'' }">
				<Button on:click={onClickedActivate} disabled={!checked}>配信アクティベート</Button>
			</div>
		</div>
	</div>
</Modal>

<!-- 配信アクティベート・完了 -->
<Modal
	bind:active={activeComplete}
	let:close
	closeable={ false }
	frameClass="w-90 pb-4"
	innerClass="pt-4"
>
	<div class="flex flex-col w-full h-full">
		<div class="fi-article flex flex-col flex-1 justify-center pt-6 pb-3 leading-relaxed text-center">
			<p>配信アクティベートが完了しました。</p>
		</div>
		<div class="flex justify-center py-3">
			<Button text on:click={close}>OK</Button>
		</div>
	</div>
</Modal>

<!-- 配信規約の再同意 -->
<Modal
	active={active && $distributorActivationStatus === 'NeedUpdate'}
	on:close={reset}
	fill
	let:fillMode
	frameClass="w-133 h-118"
>
	<div class="flex flex-col w-full h-full">
		<h4 class="relative justify-center flex-shrink-0 w-full pt-4 pb-3 pl-6 text-sm font-bold { fillMode ? '':'pt-8 pb-5 pl-0 text-2xl font-normal text-center'} border-b-1 border-base-dark border-opacity-10">
			配信規約同意確認
		</h4>
		<div class="p-6 leading-relaxed">
			<p>
				finggerの配信規約が改訂されました。<br>
				<a href="{ externalTermsUrl }" target="_blank" class="text-teal-600">配信規約</a>をご確認のうえ、<br>
				サービスをご利用いただきますようお願いいたします。
			</p>
			<p class="mt-4">
				なお、規約に同意いただけない場合、<br>
				下記機能を利用することが出来ません。<br>
				・ゲーム配信（fingger配信）<br>
				・ダイヤの報酬払い出し申請
			</p>
		</div>
		<div class="fi-border w-full border-t-1 border-base-dark border-opacity-10">
			<div class="text-center mt-6">
				<Checkbox bind:checked={checked} >
					<span class="ml-4">配信規約に同意する</span>
				</Checkbox>
			</div>
			<div class="flex flex-wrap justify-center mt-6 { fillMode ? 'pb-18':'pb-4' }">
				<Button on:click={onClickedActivate} disabled={!checked}>同意する</Button>
			</div>
		</div>
	</div>
</Modal>

<!-- 配信規約の再同意・完了 -->
<Modal
	bind:active={activeReAgreeComplete}
	acceptable
	closeable={false}
	rounded="lg"
	class="w-90"
>
	<p class="p-6 text-sm fi-lb-strict">
		配信利用規約へ同意いただきありがとうございました。
	</p>
</Modal>

<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { prepared } from '$lib/stores/user';
	import { mobile } from '$lib/stores/device';
	import { larger } from '$lib/stores/breakpoint';
	import Button from '$lib/components/Button';
	import Modal from '$lib/components/Modal';
	import Radio from '$lib/components/Radio';
	import TextArea from '$lib/components/TextArea';
	import { openModal } from '$lib/components/Login';
	import { ReportApi } from '$lib/apis';
	import { strLength } from '$lib/functions/util';
	import tooltip from '$lib/actions/tooltipTrigger';

	const typeDistribution = 'distribution';
	const typeComment = 'comment';
	const large = larger('md');

	let reportType = typeDistribution;

	let reportModal = false;
	let confirmModal = false;
	let guidanceModal = false;

	let reasons = [];
	let targetId = '';
	let reasonId = '';
	let message = '';
	let loading = false;
	let typeName = '';
	let isValid = false;

	$: asInner = $large && (reportType === typeComment);
	$: hasDetails = (reasonId === 'other' || reportType === typeDistribution);
	$: reportable = reasonId.length && (!hasDetails || (hasDetails && isValid));
	$: if(reportType) {
		switch(reportType) {
			case typeDistribution:
				typeName = '動画';
				break;
			case typeComment:
				typeName = 'コメント';
				break;
		}
	}

	function reset() {
		loading = false;
		isValid = false;
		reasonId = '';
		message = '';
		reportModal = false;
		confirmModal = false;
		guidanceModal = false;
	}

	export function open(type) {
		reset();
		reportType = type;
		if($prepared) {
			reportModal = true;
		}
		else {
			guidanceModal = true;
		}
	}

	export function openAsDistribution(id) {
		targetId = id;
		open(typeDistribution);
	}

	export function openAsComment(id) {
		targetId = id;
		open(typeComment);
	}

	function onClickedLoginButton(){
		guidanceModal = true;
		openModal();
	}

	function fetchReasons() {
		return ReportApi
			.getApiV1ReportReasons()
			.then(data => {
				reasons = data;
			}).catch(console.warn);
	}

	function sendReport() {
		const requestReason = {
			reasonId,
			message: hasDetails ? message : ''
		};
		let promise;
		loading = true;
		if(reportType === typeDistribution) {
			promise = ReportApi.postApiV1ReportDistributions({
				distributionUuid: targetId,
				requestBody: requestReason
			});
		} else {
			promise = ReportApi.postApiV1ReportComments({
				commentUuid: targetId,
				requestBody: requestReason
			});
		}
		return promise
			.catch(console.error)
			.finally(() => {
				loading = false;
				reportModal = false;
			});
	}

	function onClickedReportButton(){
		confirmModal = true;
	}

	async function onClickedConfirmButton(){
		confirmModal = false;
		await sendReport();
		reasonId = '';
		message = '';
	}

	function onInputAndValidate() {
		const overflowed = strLength(message) > 200;
		const vacant = /^\s*$/.test(message) || message.length === 0;
		isValid = !overflowed && !vacant;
	}

	onMount(async () => {
		await fetchReasons();
	});
</script>

<Modal
	bind:active={ reportModal }
	class="w-160 max-h-full"
	rounded={ asInner ? 'lg' : 'xl'}
	fill={ !asInner }
	fixed={ !asInner }
>
	<!-- modal content -->
	<div
		class:default={ !$mobile && !asInner }
		class:mobile={ $mobile }
		class:intension={ asInner }
		class="report-wrapper inset-0 flex flex-col w-full h-full">
		<h4
			class="relative justify-center flex-shrink-0 w-full text-sm border-b-1 border-base-dark border-opacity-10">
			<slot name="header">{ typeName }の報告</slot>
		</h4>
		<div class="forms flex-1 overflow-y-scroll">
			<ul>
				{#each reasons as item, index}
					<li class="flex flex-row py-3 text-sm" class:border-b={ index < reasons.length - 1 }>
						<Radio bind:group={reasonId} value={item.reasonId} class="align-middle">
							<div class="ml-3">{item.reason}</div>
						</Radio>
						<i class="text-lg md:text-xl font-light icon fingger-question-circle"
							use:tooltip={{
								position: 'top',
								label: item.description,
								offset:{ y: -5 },
								customClass: 'z-1000' /* FIXME: モーダルのz-index調整をするまでの仮調整 */
							}}
						></i>
					</li>
				{/each}
			</ul>
			{#if hasDetails }
				<div transition:slide={{ duration: (asInner || $mobile) ? 200 : 0 }} class="details fi-border border-t">
					<p class="pb-3">
						報告内容を入力してください<span class="text-error-light dark:text-rose-300;">（必須）</span>
					</p>
					<TextArea
						class="max-w-full min-h-14"
						placeholder="内容を入力"
						textSize={ $mobile ? 'base' : 'sm' }
						fill
						on:input={ onInputAndValidate }
						bind:value={message}
					/>
				</div>
			{/if}
		</div>
		<hr class="fi-border w-full border-t-1 border-base-dark border-opacity-10">
		<div class="footer">
			<Button text={ asInner } loading={ loading } disabled={ !reportable } on:click={ onClickedReportButton }>報告する</Button>
		</div>
	</div>
</Modal>

<Modal
	bind:active={ guidanceModal }
	rounded="lg"
	class="w-280px"
	acceptable
	cancelable
	closeable={ false }
	acceptLabel="ログイン"
	on:accept={ onClickedLoginButton }
>
	<div class="pt-6 px-6 pb-4 text-sm">
		不適切な{ typeName }を報告するにはログインしてください。
	</div>
</Modal>

<Modal
	bind:active={ confirmModal }
	rounded="lg"
	fixed={ !asInner }
	class="w-280px"
	acceptable
	cancelable
	closeable={ false }
	on:accept={ onClickedConfirmButton }
>
	<div class="pt-6 px-6 pb-4 text-sm">
		本当に報告しますか？
	</div>
</Modal>

<style lang="scss">
	.report-wrapper {
		&.default {
			@apply h-630px;
			h4 {
				@apply pt-8 pb-5 text-2xl text-center;
			}
			.forms {
				li {
					@apply px-8;
					:global(label) {
						@apply pr-3;
					}
				}
				.details {
					@apply py-6 px-8;
				}
			}
			.footer {
				@apply mt-8 pb-8 text-center;
			}
		}
		&.intension {
			h4 {
				@apply pt-5 pl-5 pb-3 text-xl;
			}
			.forms {
				li {
					@apply pl-5;
					:global(label) {
						@apply pr-2;
					}
				}
				.details {
					@apply pt-5 px-5 pb-6;
				}
			}
			.footer {
				@apply mt-2 px-2 pb-2 text-right;
			}
		}
		&.mobile {
			h4 {
				@apply pt-4 pb-3 pl-4 font-bold;
			}
			.forms {
				li {
					@apply px-4;
					:global(label) {
						@apply pr-1;
					}
				}
				.details {
					@apply pt-5 px-4 pb-8;
				}
			}
			.footer {
				@apply mt-3 pb-3 text-center;
			}
		}
	}
</style>

<script lang="ts">
	import { supportId, prepared } from '$lib/stores/user';
    import Modal from '$lib/components/Modal';

    const contactUrl = `${ import.meta.env.url_contact }`;
    let betaVersionModal = false;

    $: links = [
        {
            name: '利用規約',
            to: `${ import.meta.env.url_terms_of_service }`,
            target: '_blank'
        },
        {
            name: 'プライバシーポリシー',
            to: `${ import.meta.env.url_privacy_policy }`,
            target: '_blank'
        },
        {
            name: '特定商取引法に基づく表記',
            to: `${ import.meta.env.url_specific_trade_law }`,
            target: '_blank'
        },
        {
            name: 'お問い合わせ',
            to: $prepared ? contactUrl + $supportId : contactUrl + 0,
            target: '_blank'
        },
        {
            name: '会社概要',
            to: 'https://corp.fingger.com',
            target: '_blank'
        },
        {
            name: 'ヘルプ',
            to: `${ import.meta.env.url_help }`,
            target: '_blank'
        },
    ];

    function onClickBetaDescription(e) {
        e.preventDefault();
        e.stopPropagation();
        betaVersionModal = true;
    }
</script>

<div class="fi-text-sub {$$props.class || ''}">
    {#each links as item, index}
        <a href="{item.to}" target="{item.target}">{item.name}</a>
        {#if index < links.length}<span class="mx-2px">|</span>{/if}
    {/each}
    <a href={''} on:click|preventDefault={ onClickBetaDescription }>β版とは</a>
    <span class="mx-2px">|</span>
</div>

<Modal bind:active={ betaVersionModal } closeable rounded="lg" class="w-640px">
    <!-- licenseModal content -->
    <div class="min-w-280px px-6 py-8 md:(px-8 py-8)">
        <h4 class="text-xl px-1 md:px-2">β版とは</h4>
        <hr>
        <p class="w-full py-3 px-3 md:(px-5 py-4) text-sm leading-6">
            正式サービス開始に先駆けゲームバランスの調整およびサーバー負荷の検証を目的としたβ版テストを実施しております。
        </p>
        <h4 class="mt-4 text-xl px-1 md:px-2">ご意見ご要望について</h4>
        <hr>
        <p class="w-full pt-3 pb-4 px-3 md:(px-5 pt-4 pb-5) text-sm leading-6">
            β版テストに関するご意見ご要望はこちらの <a class="text-primary-light dark:text-primary-dark" href="https://support.fingger.com/hc/ja/requests/new?ticket_form_id=1900000049408&supportId=f1ea7d10-186f-4ae9-848b-7a38f3d26c2b" target="_blank">フォーム</a> よりご連絡お願いいたします。
        </p>
        <span class="text-xs opacity-50">{ import.meta.env.client_version }</span>
    </div>
</Modal>
<script context="module" lang="ts">
    import { notify } from '$lib/functions/util';
    import { inspect } from '$lib/functions/network';
    import { loginModal } from '$lib/stores/ui';

    export async function openModal() {
        if (await inspect()) {
            loginModal.set(true);
            return true;
        } else {
            notify('オフライン状態です。通信状態をご確認ください。');
            return false;
        }
    }
</script>
<script lang="ts">
    import { dark } from '$lib/stores/theme';
    import { termsAgreedAt } from '$lib/stores/user';
    import { verifying, signIn } from '$lib/services/auth/';
    import Button from '$lib/components/Button';
    import Modal from '$lib/components/Modal/Modal.svelte';
    import Checkbox from '$lib/components/Checkbox';
    import ErrorDocument from '$lib/components/ErrorDocument';

    let checked = false;
    let processing = false;
    let shouldAgree = true;

    $: if ($loginModal) {
        checked = false;
        shouldAgree = !$termsAgreedAt
    }

    export async function onClickedOpenModal() {
        if (await openModal()) {
            checked = false;
            processing = false;
        }
    }

    function onClickedLoginButton() {
        processing = true;

        signIn()
            .then(result => {
                if(result && shouldAgree) {
                   // NOTE: 利用規約同意したときの日付をセット
                    $termsAgreedAt = Date.now();
                }
                $loginModal = false;
                processing = false;
            });
    }
</script>

<Modal class="sm:w-sm min-w-full md:min-w-0" bind:active={ $loginModal }>
    <!-- trigger -->
    <div slot="trigger">
        <Button disabled={ $verifying } loading={ $verifying } on:click={ onClickedOpenModal }>
            ログイン
        </Button>
    </div>

    <!-- modal content -->
    {#if navigator.cookieEnabled}
        {#if shouldAgree}
            <h3 class="pt-16 text-center">
                <img class="m-auto h-24" src="/assets/images/icons/beta/logo-xl{ $dark ? '@dark' : '' }.svg" alt="fingger" width="auto" height="96" />
                <p class="pt-10 px-6 text-xs m-auto w-3/4">
                    <a href="{ import.meta.env.url_terms_of_service }" target="_blank" class="text-teal-600">finggerの利用規約・プライバシーポリシー・外部サービス</a>とのID連携に関する同意事項に同意頂いた上で、次にお進みください。
                </p>
            </h3>
            <hr class="mx-2 mt-5">
            <div class="flex items-center justify-center mt-6">
                <Checkbox bind:checked={checked} >
                    <span class="ml-6">利用規約に同意する</span>
                </Checkbox>
            </div>
        {:else}
            <h3 class="pt-16 text-center">
                <img class="m-auto h-24" src="/assets/images/icons/beta/logo-xl{ $dark ? '@dark' : '' }.svg" alt="fingger" width="auto" height="96" />
                <div class="mt-5">ログイン</div>
            </h3>
        {/if}

        <div class="services md:px-8 pt-22 pb-33 md:pb-35">
            <!-- NOTE: CTA計測用セレクタとして cta-login クラスをセットしています -->
            <Button loading={processing} disabled={(!checked && shouldAgree) || processing} on:click={ onClickedLoginButton } text outlined nogutters rounded="2.5xl"
                class="cta-login youtube m-auto block w-full h-12 max-w-sm text-base-dark">
                <div class="px-4 inline-flex items-center w-full h-full justify-around">
                    <i class="ml-2 icon fingger-human-key text-white text-2xl dark:text-opacity-87"></i>
                    <div class="flex-grow text-center text-white font-light dark:text-opacity-87">YouTubeでログイン</div>
                </div>
            </Button>
        </div>
    {:else}
        <ErrorDocument class="pt-16 pb-22">
            <span slot="title">Oh no!</span>
            <div slot="message" class="m-auto w-max-280px">本サイトでは必要な情報（ログイン情報等）を保持するためにブラウザのCookieを利用しています。<br><br>Cookieを有効にしてください。</div>
        </ErrorDocument>
    {/if}

</Modal>

<style lang="scss">
    .services :global(.youtube) {
        background-color: #CC1500 !important;
        color: white;
        width: 280px;
        max-width: calc(100% - 64px);

        &:hover {
            background-color: #E06E61 !important;
        }
    }
    .services :global(.youtube.disabled) {
        background-color: #DADBDC !important;
    }
    .services :global(.youtube.pressed) {
        background-color: #EAA199 !important;
    }
    .services :global(.youtube svg path) {
        fill: rgba(255, 255, 255, 0.6);
    }
</style>
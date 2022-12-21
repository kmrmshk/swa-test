<script lang="ts">
    import template from 'lodash/template';
    import Modal from '$lib/components/Modal';
    import Button from '$lib/components/Button';
    import { Swiper, SwiperSlide } from 'swiper/svelte';
	import { FreeMode } from 'swiper';
    import { smaller } from '$lib/stores/breakpoint';
    import { mobile, landscape } from '$lib/stores/device';
    import { notify, copyToClipboard } from '$lib/functions/util';

    export let active = false;
    export let href = '';
    export let text = '';

    let sm = smaller('sm');

    $:asDrawer = $sm || ($mobile && $landscape);

    const behaviorTypes = {
        ClipBoard: 'clipboard',
        OpenPage: 'openpage'
    };

    const swiperOptions = {
        loop: false,
		spaceBetween: 1,
        slidesPerGroupAuto: true,
		slidesPerView: 'auto',
		virtualTranslate: false,
		centerInsufficientSlides: false,
		modules: [ FreeMode ],
		freeMode: {
			enable: true,
			freeModeMinimumVelocity: 0.2,
			freeModeMomentum: true,
		},
	}

    const services = [
        {
            label: 'リンクをコピー',
            type: behaviorTypes.ClipBoard,
            icon: '/assets/images/icons/share/circle-clipboard.svg',
            href: null
        },
        {
            label: 'Twitter',
            type: behaviorTypes.OpenPage,
            icon: '/assets/images/icons/share/circle-twitter.svg',
            href: template('https://twitter.com/intent/tweet?url=<%- href %>&text=<%- text %>&related=finggerOfficial')
        },
        {
            label: 'LINE',
            type: behaviorTypes.OpenPage,
            icon: '/assets/images/icons/share/circle-line.svg',
            href: template('https://timeline.line.me/social-plugin/share?url=<%- href %>')
        },
        {
            label: 'Facebook',
            type: behaviorTypes.OpenPage,
            icon: '/assets/images/icons/share/circle-facebook.svg',
            href: template('https://www.facebook.com/sharer/sharer.php?u=<%- href %>')
        }
    ];

    function onClickedSharingButton(targetService) {
        switch(targetService.type) {
            case behaviorTypes.ClipBoard: {
                copyToClipboard(href);
                notify('リンクをコピーしました');
                break;
            }
            case behaviorTypes.OpenPage: {
                const url = targetService.href({ href, text });
                window.open(url, '_blank');
                break;
            }
        }
    }
</script>

<Modal
    bind:active={ active }
    fill={ asDrawer }
    rounded="lg"
    class={ asDrawer ? 'self-end h-auto' : 'self-start' }
    frameClass="w-full max-w-530px"
    fixed={ asDrawer }
>
    <h2 class="{asDrawer ? 'pt-5 pb-3 px-6' : 'pt-4 pb-2 px-4'} text-lg text-left">共有</h2>
    <hr>
    <div class="sns-share px-2 md:px-4 pt-1 md:pt-3 pb-2">
        <Swiper { ...swiperOptions } >
            {#each services as service}
                <SwiperSlide>
                    <Button nogutters plain rounded="xl" on:click={() => onClickedSharingButton(service)}>
                        <div class="inline-flex flex-col items-center justify-start gap-7 py-4 w-auto">
                            <img class="px-4" src={service.icon} alt={service.label}>
                            <span class="text-xs font-normal">{ service.label }</span>
                        </div>
                    </Button>
                </SwiperSlide>
            {/each}
        </Swiper>
    </div>
</Modal>

<style>
    :global(.sns-share .swiper-slide) {
        width: auto;
    }
</style>
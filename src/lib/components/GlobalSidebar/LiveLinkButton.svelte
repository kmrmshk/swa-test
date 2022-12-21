<script>
	import { dark } from '$lib/stores/theme';
	import Avatar from '$lib/components/Avatar';
	import { toApproxNumber } from '$lib/functions/util';
	import { goto } from '$app/navigation';

	export let userUuid = '';
	export let uuid = '';
	export let onAir = false
	export let thumbnailUrl = '';
	export let channelName = '';
	export let distributionTitle = '';
	export let viewersNum = 0;
	export let official = false;
	export let shrink = false;

	$: href = `${ onAir ? '/streams' : '/archives'}/${ uuid }`;

	function onClickedAvatar(){
		if(shrink){
			goto(href);
		}
		else{
			goto(`/users/${userUuid}`);
		}
	}
</script>

<div class="flex px-4 py-2 w-full justify-between cursor-pointer transition hover:(bg-base-dark bg-opacity-10) hover:dark:(bg-white bg-opacity-8)"
    ontouchstart=""
    on:click={() => goto(href)}>
    <Avatar
        on:click={onClickedAvatar}
        thumbnail={thumbnailUrl}
        size={shrink ? 34 : 48}
        rounded={shrink ? 'xl' : '2xl'}
        style="{ official ? 'box-shadow: 0 0 0 3px #06A3B4;' : ''}"
        class="flex-shrink-0 flex-grow-0 { shrink ? '' : 'mr-2' }"
    />
    <div class="flex flex-col justify-evenly text-left flex-grow" class:hidden={shrink}>
        <h4 title={ channelName} class="fi-lb text-sm line-clamp-1 fi-anchor cursor-pointer">{ channelName }</h4>
        <h5 class="fi-text-sub fi-lb fi-anchor text-xs font-light line-clamp-1" title={ distributionTitle }>{distributionTitle }</h5>
    </div>
    <div class="fustify-end self-end flex-grow-0 flex-shrink-0 items-around text-base-dark" class:hidden={shrink}>
        <!-- いいね数 -->
        <!--
        {#if likeCount}
            <p class="flex items-center">
                {#if false}
                    <i class="text-xl text-base-dark dark:text-base-light leading-none icon fingger-thumbs-up"></i>
                {:else}
                    <i class="text-xl text-base-dark dark:text-base-light leading-none icon fingger-thumbs-up-outline"></i>
                {/if}
                <span class="ml-2 text-xs font-light">{ toApproxNumber(likeCount) }</span>
            </p>
        {/if}
        -->
        <!-- 視聴数・再生数 -->
        <p class="flex items-center">
            {#if onAir}
                <img class="mr-2" src="/assets/images/icons/icon-live{$dark ? '@dark' : ''}.svg" alt="live" width="20" height="auto"/>
            {:else}
                <i class="text-xl leading-none icon fingger-eye mr-2"></i>
            {/if}
            <span class="text-xs font-light">{ toApproxNumber(viewersNum) }</span>
        </p>
    </div>
</div>
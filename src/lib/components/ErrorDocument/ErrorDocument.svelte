<script lang="ts">
	import { dark } from '$lib/stores/theme';
</script>

<article class="flex w-full h-full items-center justify-center {$$props.class || ''}">
	<section class="text-center">
		<figure class="inline-flex w-28 h-28 rounded-full items-center justify-center bg-base-dark bg-opacity-12 dark:(bg-white bg-opacity-12)">
			<img src="/assets/images/icons/icon-error{ $dark ? '@dark' : ''}.svg" alt="error" width="61" height="auto">
		</figure>
		<h2 class="mt-6 text-xl">
			<slot name="title"/>
		</h2>
		<p class="fi-text-sub mt-7 text-xs font-light">
			<slot name="message"/>
		</p>
	</section>
</article>
<script lang="ts">
	import { verifying } from '$lib/services/auth';
    import { openModal } from '$lib/components/Login';
    import Button from '$lib/components/Button';
</script>
<div {...$$restProps} class="fi-border relative w-full mx-auto round dark:bg-gray-900 {$$props.class || ''}">
	<div class="flex items-center justify-center flex-col w-full h-full">
		<p class="mb-9 text-sm">
			<slot/>
		</p>
        <Button disabled={ $verifying } loading={ $verifying } on:click={ openModal }>ログイン</Button>
	</div>
</div>
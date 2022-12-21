<script lang="ts">
	import Card from '$lib/components/Card';
	export let data:any|null = null;
	export let level = 0;
	export let flatten = false;
	export let headingClass = '';
	export let sectionClass = '';
	export let cardClass = '';

	const isObject = (v:any) => v !== null && typeof(v) === 'object' && v.constructor === Object;
	const isField = (v:any) => isObject(v) && v.hasOwnProperty('name') && v.hasOwnProperty('value');
</script>

{#if isField(data)}<!-- name:value の組み合わせを持つオブジェクト -->
	{#if level <= 1}
		<div>
			<h2 class="py-2 font-bold text-sm md:text-xl text-base-dark text-opacity-60 dark:(text-base-light text-opacity-60) { headingClass }">
				{@html data.name}
			</h2>
			<section class="mb-3 { sectionClass }">
				<svelte:self
					data={data.value}
					level={level + 1}
					sectionClass={level > 1 ? sectionClass : ''}
					{headingClass}
					{cardClass}
				/>
			</section>
		</div>
	{:else}
		<Card rounded="lg" class="fi-border px-4 py-3 bg-white dark:bg-gray-900 border-1 shadow-02dp {cardClass}">
			<div class="flex flex-col items-start justify-center">
				<h4 class="fi-text-sub text-sm">{@html data.name}</h4>
				<!-- // NOTE: Cardに内包されるので flatten 指定 -->
				<svelte:self data={data.value} {level} flatten {headingClass} {sectionClass} {cardClass} />
			</div>
		</Card>
	{/if}
{:else if isObject(data)}<!-- オブジェクト -->
	{#each Object.entries(data) as [key, value]}
		<Card rounded="lg" class="fi-border px-4 py-3 bg-white dark:bg-gray-900 border-1 shadow-02dp {cardClass}">
			<div class="flex flex-col items-start justify-center">
				<h4 class="fi-text-sub text-sm">{@html key}</h4>
				<!-- // NOTE: Cardに内包されるので flatten 指定 -->
				<svelte:self data={value} {level} flatten {headingClass} {sectionClass} {cardClass} />
			</div>
		</Card>
	{/each}
{:else if Array.isArray(data)}<!-- 配列 -->
	{#each data as item}
		<svelte:self data={item} {level} {flatten} {headingClass} {sectionClass} {cardClass} />
	{/each}
{:else if typeof(data) === 'string'}<!-- 文字列 -->
	{#if flatten}
		<p class="break-words">{@html data}</p>
	{:else}
		<Card rounded="lg" class="fi-border px-4 py-3 bg-white dark:bg-gray-900 border-1 shadow-02dp break-words {cardClass}">
			{@html data}
		</Card>
	{/if}
{:else if typeof(data) === 'number'}<!-- 数字 -->
	{#if flatten}
		<p class="break-words">{@html data.toLocaleString()}</p>
	{:else}
		<Card rounded="lg" class="fi-border px-4 py-3 bg-white dark:bg-gray-900 border-1 shadow-02dp break-words {cardClass}">
			{@html data.toLocaleString()}
		</Card>
	{/if}
{/if}
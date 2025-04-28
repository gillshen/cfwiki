<script lang="ts">
	import { cn } from '$lib/utils';

	export let id: string;
	export let title: string = '';
	export let hrule: boolean = false;
	export let className: string = '';
	export { className as class };
</script>

<section {id} class={cn('pb-6 mb-2 space-y-2 text-sm', className)}>
	{#if title}
		<div class="sticky top-[102px] bg-white z-10">
			<h2 class="text-xl font-bold pb-2">{title}</h2>
			<hr class="text-stone-400 pb-2" />
		</div>
	{:else if hrule}
		<hr class="text-stone-400 pb-2" />
	{/if}
	<slot />
</section>

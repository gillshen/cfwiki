<script lang="ts">
	import { cn } from '$lib/utils';

	export let id: string;
	export let title: string = '';
	export let hrule: boolean = false;
	export let hruleClass: string = '';
	export let className: string = '';
	export { className as class };
</script>

<section {id} class={cn('pb-8 mb-2 flex flex-col gap-2 text-sm', className)}>
	{#if title}
		<div class="sticky top-[112px] bg-white z-10">
			<h2 class="text-xl font-bold pb-2">{title}</h2>
			<hr class={cn('pb-2', hruleClass)} />
		</div>
	{:else if hrule}
		<hr class={cn('pb-2', hruleClass)} />
	{/if}
	<slot />
</section>

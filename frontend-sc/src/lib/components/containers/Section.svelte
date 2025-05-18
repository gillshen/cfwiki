<script lang="ts">
	import { cn } from '$lib/utils';

	export let id: string;
	export let title: string = '';
	export let titleContainerClass: string = '';
	export let titleOnly: boolean = false;
	export let hrule: boolean = false;
	export let hruleClass: string = '';
	export let className: string = '';
	export { className as class };
</script>

<section {id} class={cn('flex flex-col gap-4 text-sm pb-12 last:pb-4', className)}>
	{#if title}
		<div class={titleContainerClass}>
			<h3 class="text-xl font-bold">{title}</h3>
			{#if !titleOnly}
				<hr class={cn('my-2', hruleClass)} />
			{/if}
		</div>
	{:else if hrule}
		<hr class={cn('my-2', hruleClass)} />
	{/if}
	<slot />
</section>

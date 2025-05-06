<script lang="ts">
	import { cn } from '$lib/utils';

	export let id: string;
	export let title: string = '';
	export let titleOnly: boolean = false;
	export let hruleOnly: boolean = false;
	export let hruleClass: string = '';
	export let className: string = '';
	export { className as class };
</script>

<section {id} class={cn('flex flex-col gap-4 text-sm pb-12 last:pb-4', className)}>
	{#if title}
		<div class="sticky top-[112px] bg-white z-10">
			<h2 class="text-xl font-bold">{title}</h2>
			{#if !titleOnly}
				<hr class={cn('my-2', hruleClass)} />
			{/if}
		</div>
	{:else if hruleOnly}
		<hr class={cn('my-2', hruleClass)} />
	{/if}
	<slot />
</section>

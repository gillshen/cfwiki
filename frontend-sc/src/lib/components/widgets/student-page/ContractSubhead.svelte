<script lang="ts">
	import type { Service } from '$lib/api/contract';
	import { endedEarly } from '$lib/util/serviceUtils';
	import { cn } from '$lib/utils';

	export let servicesGrouped: Record<string, Service[]>;
	export let className: string = '';
	export { className as class };
</script>

<div class={cn('w-fit px-4 inline-flex items-baseline', className)}>
	{#if Object.keys(servicesGrouped).length === 0}
		<span class="italic">No services</span>
	{/if}
	{#each Object.entries(servicesGrouped) as [username, services], index}
		{@const stayedTillEnd = services.map((s) => !endedEarly(s)).some(Boolean)}
		<span class="inline-flex items-center gap-1">
			{#if index},
			{/if}<span class={stayedTillEnd ? '' : 'line-through'}>{username}</span>
		</span>
	{/each}
</div>

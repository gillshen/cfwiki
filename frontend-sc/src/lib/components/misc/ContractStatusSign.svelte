<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { cn } from '$lib/utils';
	import Clock from 'lucide-svelte/icons/clock';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import CircleMinus from 'lucide-svelte/icons/circle-minus';

	import type { ContractStatus } from '$lib/api/contract';

	export let status: ContractStatus | null | undefined;
	export let className: string = '';
	export { className as class };

	const statusMap: Record<ContractStatus, { label: string; icon: ComponentType }> = {
		'In effect': { label: 'In Effect', icon: Clock },
		Fulfilled: { label: 'Fulfilled', icon: CircleCheck },
		Terminated: { label: 'Terminated', icon: CircleMinus }
	};
</script>

{#if status}
	<div class={cn('flex items-center gap-1.5 text-sm h-5', className)}>
		<svelte:component this={statusMap[status].icon} class="size-4 shrink-0 translate-y-[0.5px]" />
		<div class="truncate">{statusMap[status].label}</div>
	</div>
{/if}

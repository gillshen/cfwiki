<script lang="ts">
	import { cn } from '$lib/utils';
	import Clock from 'lucide-svelte/icons/clock';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import CircleMinus from 'lucide-svelte/icons/circle-minus';

	import type { ContractStatus } from '$lib/api/contract';

	export let status: ContractStatus | null | undefined;
	export let height: string = '20px';

	const statusMap: Record<ContractStatus, { label: string; color: string }> = {
		'In effect': { label: 'In Effect', color: 'text-primary' },
		Fulfilled: { label: 'Fulfilled', color: 'text-muted-foreground' },
		Terminated: { label: 'Terminated', color: 'text-rose-700' }
	};
</script>

{#if status}
	<div class={cn('flex items-center gap-1.5 text-sm', `h-[${height}]`, statusMap[status].color)}>
		{#if status === 'In effect'}
			<Clock class="size-4 shrink-0 translate-y-[0.5px]" />
		{:else if status === 'Fulfilled'}
			<CircleCheck class="size-4 shrink-0 translate-y-[0.5px]" />
		{:else}
			<CircleMinus class="size-4 shrink-0 translate-y-[0.5px]" />
		{/if}
		<div class="truncate">{statusMap[status].label}</div>
	</div>
{/if}

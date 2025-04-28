<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ContractStatus } from '$lib/api/contract';

	export let status: ContractStatus | null | undefined;
	export let height: string = '20px';

	const statusMap: Record<ContractStatus, { label: string; color: string }> = {
		'In effect': { label: 'In Effect', color: 'bg-mint-500' },
		Fulfilled: { label: 'Fulfilled', color: 'bg-primary/50' },
		Terminated: { label: 'Terminated', color: 'bg-rose-700' }
	};
</script>

{#if status}
	<div class={cn('flex items-center gap-1.5 text-sm', `h-[${height}]`)}>
		<div class={`size-[14px] rounded-full ${statusMap[status].color}`}></div>
		<div>{statusMap[status].label}</div>
	</div>
{/if}

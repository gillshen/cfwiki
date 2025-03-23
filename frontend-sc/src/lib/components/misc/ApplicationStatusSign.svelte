<script lang="ts">
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import CircleX from 'lucide-svelte/icons/circle-x';
	import CircleHelp from 'lucide-svelte/icons/circle-help';
	import Ban from 'lucide-svelte/icons/ban';

	import type { ApplicationLogBrief } from '$lib/api/applicationLog';
	import { formatNotableStatuses, getNotableStatuses } from '$lib/util/applicationUtils';

	export let application: { logs: ApplicationLogBrief[] };

	const statuses = getNotableStatuses(application);
	const formattedStatuses = formatNotableStatuses(statuses);
	const latestStatus = statuses[statuses.length - 1];

	let icon: 'check' | 'x' | 'question' | 'ban';

	switch (latestStatus) {
		case 'Accepted':
			icon = 'check';
			break;
		case 'Rejected':
		case 'Pres. Rejected':
		case 'Offer Rescinded':
			icon = 'x';
			break;
		case 'Cancelled':
		case 'Withdrawn':
		case 'Untracked':
			icon = 'ban';
			break;
		default:
			icon = 'question';
	}
</script>

{#if latestStatus}
	<div class="flex items-center gap-1.5">
		{#if icon === 'check'}
			<CircleCheckBig class="text-green-600 w-[18px] h-[18px]" />
		{:else if icon === 'x'}
			<CircleX class="text-red-600 w-[18px] h-[18px]" />
		{:else if icon === 'ban'}
			<Ban class="text-zinc-400 w-[18px] h-[18px]" />
		{:else}
			<CircleHelp class="text-orange-500 w-[18px] h-[18px]" />
		{/if}
		<span class="font-medium truncate">{formattedStatuses}</span>
	</div>
{/if}

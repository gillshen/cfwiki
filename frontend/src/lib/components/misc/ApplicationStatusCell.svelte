<script lang="ts">
	import {
		CheckCircleSolid,
		CloseCircleSolid,
		HourglassSolid,
		CircleMinusSolid
	} from 'flowbite-svelte-icons';

	import type { ComposedApplication } from '$lib/api/application';

	import {
		formatNotableStatuses,
		getNotableStatuses,
		statusToClass
	} from '$lib/utils/applicationUtils';

	export let application: ComposedApplication;

	const statuses = getNotableStatuses(application);
	const formattedStatuses = formatNotableStatuses(statuses);
	const latestStatus = statuses[statuses.length - 1];

	let icon: 'check' | 'close' | 'hourglass' | 'minus';

	switch (latestStatus) {
		case 'Accepted':
			icon = 'check';
			break;
		case 'Rejected':
		case 'Pres. Rejected':
		case 'Offer Rescinded':
			icon = 'close';
			break;
		case 'Cancelled':
		case 'Withdrawn':
		case 'Untracked':
			icon = 'minus';
			break;
		default:
			icon = 'hourglass';
	}

	const iconClass = `status-${statusToClass(latestStatus)} size-4`;
</script>

{#if latestStatus}
	<div class="flex items-center gap-1.5">
		{#if icon === 'check'}
			<CheckCircleSolid class={iconClass} />
		{:else if icon === 'close'}
			<CloseCircleSolid class={iconClass} />
		{:else if icon === 'minus'}
			<CircleMinusSolid class={iconClass} />
		{:else}
			<HourglassSolid class={iconClass} />
		{/if}
		<span class={`font-medium${icon === 'minus' ? ' text-gray-500' : ''}`}>
			{formattedStatuses}
		</span>
	</div>
{/if}

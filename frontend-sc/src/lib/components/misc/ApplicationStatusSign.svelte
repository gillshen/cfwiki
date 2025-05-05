<script lang="ts">
	import type { ComponentType } from 'svelte';

	import { cn } from '$lib/utils';
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import CircleX from 'lucide-svelte/icons/circle-x';
	import CircleHelp from 'lucide-svelte/icons/circle-help';
	import Clock from 'lucide-svelte/icons/clock';
	import Ban from 'lucide-svelte/icons/ban';

	import type { ApplicationLogBrief, ApplicationStatus } from '$lib/api/applicationLog';
	import { formatNotableStatuses, getNotableStatuses } from '$lib/util/applicationUtils';

	export let application: { logs: ApplicationLogBrief[] };
	export let iconOnly: boolean = false;
	export let iconClass: string = '';
	export let className: string = '';
	export { className as class };

	type Icon = {
		icon: ComponentType;
		className: string;
	};

	const inProgressIcon: Icon = { icon: Clock, className: 'text-sky-600/70' };
	const acceptedIcon: Icon = { icon: CircleCheckBig, className: 'text-mint-400' };
	const rejectedIcon: Icon = { icon: CircleX, className: 'text-rejected' };
	const deferredIcon: Icon = { icon: CircleHelp, className: 'text-deferred' };
	const neutralIcon: Icon = { icon: Ban, className: 'text-muted-foreground/70 ' };

	const statusMap: Record<ApplicationStatus, Icon> = {
		Started: inProgressIcon,
		Submitted: inProgressIcon,
		'Under Review': inProgressIcon,
		Accepted: acceptedIcon,
		Deferred: deferredIcon,
		'On Waitlist': deferredIcon,
		Rejected: rejectedIcon,
		'Pres. Rejected': rejectedIcon,
		'Offer Rescinded': rejectedIcon,
		Cancelled: neutralIcon,
		Withdrawn: neutralIcon,
		Untracked: neutralIcon
	};

	const statuses = getNotableStatuses(application);
	const formattedStatuses = formatNotableStatuses(statuses);
	const latestStatus = statuses[statuses.length - 1];
</script>

{#if latestStatus}
	<div class={cn('text-sm flex items-center gap-1.5 h-6', className)}>
		<svelte:component
			this={statusMap[latestStatus].icon}
			class={cn('size-4 shrink-0', statusMap[latestStatus].className, iconClass)}
		/>
		{#if !iconOnly}
			<div class="flex-1 min-w-0">
				<span class="font-medium block truncate">{formattedStatuses}</span>
			</div>
		{/if}
	</div>
{/if}

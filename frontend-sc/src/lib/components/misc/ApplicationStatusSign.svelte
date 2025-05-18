<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ApplicationStatus } from '$lib/api/applicationLog';
	import { formatHistory } from '$lib/util/applicationUtils';

	export let application: { history: ApplicationStatus[] };
	export let iconOnly: boolean = false;
	export let textClass: string = '';
	export let className: string = '';
	export { className as class };

	enum StatusColors {
		InProgress = 'bg-sky-300',
		Accepted = 'bg-mint-500',
		Rejected = 'bg-red-400',
		Deferred = 'bg-yellow-300',
		Neutral = 'bg-muted-foreground/50'
	}

	const statusMap: Record<ApplicationStatus, StatusColors[keyof StatusColors]> = {
		Started: StatusColors.InProgress,
		Submitted: StatusColors.InProgress,
		'Under Review': StatusColors.InProgress,
		Accepted: StatusColors.Accepted,
		Deferred: StatusColors.Deferred,
		'On Waitlist': StatusColors.Deferred,
		Rejected: StatusColors.Rejected,
		'Pres. Rejected': StatusColors.Rejected,
		'Offer Rescinded': StatusColors.Rejected,
		Cancelled: StatusColors.Neutral,
		Withdrawn: StatusColors.Neutral,
		Untracked: StatusColors.Neutral
	};

	const formattedStatuses = formatHistory(application.history);
	const latestStatus = application.history[application.history.length - 1];
</script>

{#if latestStatus}
	<div class={cn('text-sm flex items-center gap-1.5 h-6', className)}>
		<div class={cn('size-3 shrink-0 rounded-full', statusMap[latestStatus])}></div>
		{#if !iconOnly}
			<div class="flex-1 min-w-0">
				<span class={cn('font-medium block truncate', textClass)}>{formattedStatuses}</span>
			</div>
		{/if}
	</div>
{/if}

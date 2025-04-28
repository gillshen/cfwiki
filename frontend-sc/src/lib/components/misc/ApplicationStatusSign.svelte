<script lang="ts">
	import { cn } from '$lib/utils';
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import CircleX from 'lucide-svelte/icons/circle-x';
	import CircleHelp from 'lucide-svelte/icons/circle-help';
	import Clock from 'lucide-svelte/icons/clock';
	import Ban from 'lucide-svelte/icons/ban';

	import type { ApplicationLogBrief, ApplicationStatus } from '$lib/api/applicationLog';
	import { formatNotableStatuses, getNotableStatuses } from '$lib/util/applicationUtils';

	export let application: { logs: ApplicationLogBrief[] };
	export let height: string = '24px';

	const statuses = getNotableStatuses(application);
	const formattedStatuses = formatNotableStatuses(statuses);
	const latestStatus = statuses[statuses.length - 1];

	type Icon = 'clock' | 'check' | 'big-check' | 'x' | 'ban' | 'question';

	const statusToIcon: Record<ApplicationStatus, Icon> = {
		Started: 'clock',
		Submitted: 'clock',
		'Under Review': 'clock',
		Accepted: 'big-check',
		Deferred: 'question',
		'On Waitlist': 'question',
		Rejected: 'x',
		'Pres. Rejected': 'x',
		'Offer Rescinded': 'x',
		Cancelled: 'ban',
		Withdrawn: 'ban',
		Untracked: 'ban'
	};

	const icon = statusToIcon[latestStatus];
</script>

{#if latestStatus}
	<div class={cn('text-sm flex items-center gap-1.5', `h-[${height}]`)}>
		{#if icon === 'big-check'}
			<CircleCheckBig class="text-mint-700 w-[16px] h-[16px] shrink-0" />
		{:else if icon === 'clock'}
			<Clock class="text-sky-600 w-[16px] h-[16px] shrink-0" />
		{:else if icon === 'check'}
			<CircleCheck class="text-sky-600 w-[16px] h-[16px] shrink-0" />
		{:else if icon === 'x'}
			<CircleX class="text-rose-700 w-[16px] h-[16px] shrink-0" />
		{:else if icon === 'ban'}
			<Ban class="text-zinc-400 w-[16px] h-[16px] shrink-0" />
		{:else}
			<CircleHelp class="text-orange-500 w-[16px] h-[16px] shrink-0" />
		{/if}
		<div class="flex-1 min-w-0">
			<span class="font-medium block truncate">{formattedStatuses}</span>
		</div>
	</div>
{/if}

<script lang="ts">
	import * as Timeline from '$lib/components/widgets/timeline/index';
	import PartyPopper from 'lucide-svelte/icons/party-popper';
	import type { ApplicationLog } from '$lib/api/applicationLog';
	import { toLongDate } from '$lib/util/dateUtils';

	export let log: ApplicationLog;
</script>

<Timeline.Item class="flex flex-col gap-1 min-h-[100px] pb-8">
	<h3 class="text-base font-semibold flex items-center gap-2">
		{log.status === 'Pres. Rejected' ? 'Presumed Rejected' : log.status}
		{#if log.status === 'Accepted'}
			<PartyPopper class="size-4 text-mint-700 hover:animate-[ping_1s_ease-in-out]" />
		{/if}
		<slot name="buttons" />
	</h3>
	<div class="text-muted-foreground">{toLongDate(log.date)}</div>
	{#if log.comments}
		<div class="pt-2 pr-4 text-muted-foreground">{log.comments}</div>
	{/if}
</Timeline.Item>

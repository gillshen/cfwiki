<script lang="ts">
	import { TimelineItem } from 'flowbite-svelte';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import { toLongDate } from '$lib/utils/dateUtils';

	export let log: ApplicationLog;
</script>

<TimelineItem title={log.status} date={toLongDate(log.date)}>
	{#if log.comments}
		<div class="flex flex-col gap-2 py-2 pr-4">
			{#each log.comments.split(/\r?\n/g).filter(Boolean) as para}
				<p class="text-sm font-normal text-gray-500">
					{para}
				</p>
			{/each}
		</div>
	{/if}

	<slot />
</TimelineItem>

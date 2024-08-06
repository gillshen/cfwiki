<script lang="ts">
	import { A, TimelineItem } from 'flowbite-svelte';

	import { toLongDate } from '$lib/utils/dateUtils';
	import type { ApplicationLog } from '$lib/api/applicationLog';

	export let log: ApplicationLog;
	export let updateAction: () => void;
	export let deleteAction: () => void;
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

	<div class="mt-2 flex gap-x-4">
		<A class="text-sm" on:click={updateAction}>Update</A>
		<A class="text-sm" on:click={deleteAction}>Delete</A>
	</div>
</TimelineItem>

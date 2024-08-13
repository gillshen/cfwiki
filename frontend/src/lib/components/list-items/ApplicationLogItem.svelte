<script lang="ts">
	import { TimelineItem } from 'flowbite-svelte';

	import type { ApplicationLog } from '$lib/api/applicationLog';
	import { toLongDate } from '$lib/utils/dateUtils';
	import Comments from '$lib/components/typography/Comments.svelte';

	export let log: ApplicationLog;
</script>

<TimelineItem title={log.status} date={toLongDate(log.date)}>
	{#if log.comments}
		<Comments text={log.comments} divClass="py-2 pr-4 text-sm font-normal text-gray-500" />
	{/if}

	<slot />
</TimelineItem>

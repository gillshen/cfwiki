<script lang="ts">
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
</script>

{#if latestStatus}
	<span class={`font-medium status-${statusToClass(latestStatus)}`}>{formattedStatuses}</span>
{/if}

<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ComposedApplication } from '$lib/api/application';

	import {
		formatNotableStatuses,
		getNotableStatuses,
		statusToClass
	} from '$lib/utils/applicationUtils';

	export let application: ComposedApplication;

	const notableStatuses = getNotableStatuses(application);
	const latestStatus = notableStatuses[notableStatuses.length - 1];
	const formattedLatestStatus = formatNotableStatuses(notableStatuses);
</script>

<TableBodyCell class={`status-${statusToClass(latestStatus ?? '-')}`}>
	{formattedLatestStatus || '-'}
</TableBodyCell>

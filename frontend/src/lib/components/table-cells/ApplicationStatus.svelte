<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ComposedApplicationListItem } from '$lib/api/application';

	import {
		formatNotableStatuses,
		getLatestLog,
		getNotableStatuses,
		statusToClass
	} from '$lib/utils/applicationUtils';

	export let application: ComposedApplicationListItem;

	const notableStatuses = getNotableStatuses(application);

	const latestStatus =
		notableStatuses[notableStatuses.length - 1] ?? getLatestLog(application)?.status;

	const formattedLatestStatus = formatNotableStatuses(notableStatuses) || latestStatus;
</script>

<TableBodyCell class={`status-${statusToClass(latestStatus ?? '-')}`}>
	{formattedLatestStatus || '-'}
</TableBodyCell>

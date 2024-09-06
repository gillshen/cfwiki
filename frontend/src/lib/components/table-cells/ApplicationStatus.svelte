<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ComposedApplicationListItem } from '$lib/api/application';
	import {
		formatNotableStatuses,
		getNotableStatuses,
		statusToClass
	} from '$lib/utils/applicationUtils';

	export let application: ComposedApplicationListItem;

	const statuses = getNotableStatuses(application);
	const formattedStatuses = formatNotableStatuses(statuses);
	const latestStatus = statuses[statuses.length - 1];
</script>

<TableBodyCell class={`status-${statusToClass(latestStatus ?? '-')}`}>
	{formattedStatuses || '-'}
</TableBodyCell>

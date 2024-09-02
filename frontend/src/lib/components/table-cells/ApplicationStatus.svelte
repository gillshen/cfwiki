<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ComposedApplicationListItem } from '$lib/api/application';
	import { statusToClass } from '$lib/utils/applicationUtils';

	export let application: ComposedApplicationListItem;

	const status = application.latest_log?.status;
</script>

<TableBodyCell class={`status-${statusToClass(status)}`}>{status || '-'}</TableBodyCell>

<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';
	import { statusToClass } from '$lib/utils/applicationUtils';

	export let application: ApplicationListItem;

	const status = application.latest_log?.status;
</script>

<TableBodyCell class={`status-${statusToClass(status)}`}>{status || '-'}</TableBodyCell>

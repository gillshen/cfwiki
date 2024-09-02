<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';
	import { statusToClass } from '$lib/utils/applicationUtils';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class={`status-${statusToClass(application.l_status)}`}>
	{application.l_status || '-'}
</TableBodyCell>

<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';
	import { formatMajors } from '$lib/utils/applicationUtils';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class={`font-normal max-w-[14rem] truncate`}>
	{formatMajors(application) || '-'}
</TableBodyCell>

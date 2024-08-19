<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';
	import { formatMajors } from '$lib/utils/applicationUtils';

	export let application: ApplicationListItem;
	export let maxWidth: string = '12rem';
</script>

<TableBodyCell class={`font-normal max-w-[${maxWidth}] truncate`}>
	{formatMajors(application) || '-'}
</TableBodyCell>

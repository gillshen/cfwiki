<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
	export let maxWidth: string = '12rem';
</script>

<TableBodyCell class={`font-normal max-w-[${maxWidth}] truncate`}>
	{application.program.display_name}
</TableBodyCell>

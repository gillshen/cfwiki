<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class={`font-normal max-w-[14rem] truncate`}>
	{application.program.display_name}
</TableBodyCell>

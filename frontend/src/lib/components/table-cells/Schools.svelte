<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class={`max-w-[16rem] truncate`}>
	{application.schools.map((s) => s.name).join(' + ')}
</TableBodyCell>

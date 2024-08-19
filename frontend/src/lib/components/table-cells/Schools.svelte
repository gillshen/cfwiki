<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
	export let maxWidth: string = '14rem';
</script>

<TableBodyCell class={`max-w-[${maxWidth}] truncate`}>
	{application.schools.map((s) => s.name).join(' + ')}
</TableBodyCell>

<script lang="ts">
	import { TableBodyCell, A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class="w-4 pl-2 pr-0">
	<A href={`/application/${application.id}`}><LinkOutline /></A>
</TableBodyCell>

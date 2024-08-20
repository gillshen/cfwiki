<script lang="ts">
	import { TableBodyCell, A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class="w-4 pl-2 pr-0">
	<A class="translate-y-1" href={`/application/${application.id}`}>
		<LinkOutline size="sm" />
	</A>
</TableBodyCell>

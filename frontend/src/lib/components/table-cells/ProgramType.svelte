<script lang="ts">
	import { TableBodyCell, Badge } from 'flowbite-svelte';

	import type { ComposedApplication } from '$lib/api/application';
	import { typeToBadgeColor, typeToBadgeText } from '$lib/utils/programUtils';

	export let application: ComposedApplication;
</script>

<TableBodyCell class="max-w-10">
	<Badge class={typeToBadgeColor(application.program.type)}>
		{typeToBadgeText(application.program.type)}
	</Badge>
</TableBodyCell>

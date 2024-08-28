<script lang="ts">
	import { TableBodyCell, Badge } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';
	import { typeToBadgeColor, typeToBadgeText } from '$lib/utils/programUtils';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class="max-w-10">
	<Badge color={typeToBadgeColor(application.program.type)}>
		{typeToBadgeText(application.program.type)}
	</Badge>
</TableBodyCell>

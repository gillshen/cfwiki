<script lang="ts">
	import { TableBodyCell, Badge, type ColorVariant } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;

	const getText = (programType: string) => {
		switch (programType) {
			case 'UG Freshman':
				return 'UG';
			case 'UG Transfer':
				return 'TR';
			case "Master's":
				return 'MA';
			case 'Doctorate':
				return 'DR';
			case 'Non-degree':
				return 'ND';
			default:
				return '??';
		}
	};

	const getColor = (programType: string): ColorVariant => {
		switch (programType) {
			case 'UG Freshman':
				return 'indigo';
			case 'UG Transfer':
				return 'purple';
			case "Master's":
			case 'Doctorate':
				return 'yellow';
			case 'Non-degree':
				return 'green';
			default:
				return 'none';
		}
	};
</script>

<TableBodyCell class="max-w-10">
	<Badge color={getColor(application.program.type)}>{getText(application.program.type)}</Badge>
</TableBodyCell>

<script lang="ts">
	import type { ProgramListItem } from '$lib/api/program';
	import { filterForType } from '$lib/util/programUtils';

	export let programs: ProgramListItem[];
	export let type: 'UG Freshman' | 'UG Transfer';

	const orderByName = (a: ProgramListItem, b: ProgramListItem): number => {
		return hostName(a).localeCompare(hostName(b));
	};

	const hostName = (program: ProgramListItem): string =>
		program.schools.map((s) => s.name).join(' + ');
</script>

{#if programs.length}
	<div class="grid lg:grid-cols-2 md:grid-cols-1 gap-2">
		{#each filterForType(programs, type).sort(orderByName) as program}
			<a href={`/program/${program.id}`}>{hostName(program)}</a>
		{/each}
	</div>
{/if}

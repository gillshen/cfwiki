<script lang="ts">
	import type { ProgramListItem } from '$lib/api/program';
	import ProgramItem from '$lib/components/list-items/ProgramItem.svelte';
	import { filterForType, orderByName } from '$lib/utils/programUtils';

	export let programs: ProgramListItem[];

	const freshmanPrograms = filterForType(programs, 'UG Freshman');
	const transferPrograms = filterForType(programs, 'UG Transfer');
	const mastersPrograms = filterForType(programs, "Master's");
	const doctoratePrograms = filterForType(programs, 'Doctorate');
	const nonDegreePrograms = filterForType(programs, 'Non-degree');
</script>

<div class="mt-6 text-sm flex flex-col gap-6">
	{#if freshmanPrograms.length || transferPrograms.length}
		<div class="flex flex-col gap-2">
			{#each freshmanPrograms.sort(orderByName) as program}
				<ProgramItem {program} />
			{/each}
			{#each transferPrograms.sort(orderByName) as program}
				<ProgramItem {program} />
			{/each}
		</div>
	{/if}

	{#if mastersPrograms.length}
		<div class="flex flex-col gap-2">
			{#each mastersPrograms.sort(orderByName) as program}
				<ProgramItem {program} />
			{/each}
		</div>
	{/if}

	{#if doctoratePrograms.length}
		<div class="flex flex-col gap-2">
			{#each doctoratePrograms.sort(orderByName) as program}
				<ProgramItem {program} />
			{/each}
		</div>
	{/if}

	{#if nonDegreePrograms.length}
		<div class="flex flex-col gap-2">
			{#each nonDegreePrograms.sort(orderByName) as program}
				<ProgramItem {program} />
			{/each}
		</div>
	{/if}
</div>

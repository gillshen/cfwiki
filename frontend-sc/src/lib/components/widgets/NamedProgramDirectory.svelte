<script lang="ts">
	import type { ProgramListItem } from '$lib/api/program';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import { enhanceDisplayName, filterForType } from '$lib/util/programUtils';

	export let programs: Promise<ProgramListItem[]>;
	export let type: "Master's" | 'Doctorate' | 'Non-degree';

	const groupedByHost = (programs: ProgramListItem[]): [string, ProgramListItem[]][] => {
		const grouped: { [key: string]: ProgramListItem[] } = {};

		for (const program of programs) {
			const hostAsString: string = program.schools.map((s) => s.name).join(' + ');
			if (!(hostAsString in grouped)) {
				grouped[hostAsString] = [];
			}
			grouped[hostAsString].push(program);
		}
		return Object.entries(grouped).sort();
	};
</script>

{#await programs}
	<LoadingSign />
{:then programs}
	<div class="flex flex-col gap-4">
		{#each groupedByHost(filterForType(programs, type)) as [host, groupedPrograms]}
			<div class="flex flex-col gap-2">
				<div class="font-bold">{host}</div>
				<div class="grid grid-cols-2 gap-2">
					{#each groupedPrograms as program}
						<a href={`/program/${program.id}`}>{enhanceDisplayName(program)}</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/await}

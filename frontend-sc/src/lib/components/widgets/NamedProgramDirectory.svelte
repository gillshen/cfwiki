<script lang="ts">
	import type { ProgramListItem } from '$lib/api/program';
	import { enhanceDisplayName, filterForType } from '$lib/util/programUtils';

	export let programs: ProgramListItem[];
	export let type: "Master's" | 'Doctorate' | 'Non-degree';

	const groupedByHost = (programs: ProgramListItem[]): [string, ProgramListItem[]][] => {
		const grouped: { [key: string]: ProgramListItem[] } = {};

		for (const program of programs) {
			const hostName: string = program.schools.map((s) => s.name).join(' + ');
			if (!(hostName in grouped)) {
				grouped[hostName] = [];
			}
			grouped[hostName].push(program);
		}
		return Object.entries(grouped).sort();
	};
</script>

{#if programs.length}
	<div class="flex flex-col gap-4">
		{#each groupedByHost(filterForType(programs, type)) as [host, groupedPrograms]}
			<hgroup class="">
				<h3 class="font-semibold pb-2">{host}</h3>
				<div class="flex flex-col gap-2">
					{#each groupedPrograms as program}
						<a href={`/program/${program.id}`}>{enhanceDisplayName(program)}</a>
					{/each}
				</div>
			</hgroup>
		{/each}
	</div>
{/if}

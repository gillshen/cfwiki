<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import type { ProgramDetail } from '$lib/api/program';
	import { isUndergraduate } from '$lib/utils/programUtils';
	import { lexicalChineseLast } from '$lib/utils/stringUtils';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';

	export let program: ProgramDetail;

	$: programDegree = isUndergraduate(program) ? "Bachelor's" : program.degree || '-';
</script>

<Table>
	<TableBody>
		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Type</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{program.type}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 min-w-40 font-medium py-4 align-top">
				School{program.schools.length > 1 ? 's' : ''}
			</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				<div class="flex flex-col gap-2">
					{#each program.schools.sort((a, b) => lexicalChineseLast(a.name, b.name)) as school}
						<LinkWithIcon href={`/school/${school.id}`} text={school.name} />
					{/each}
				</div>
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Name</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{program.name || '-'}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Degree</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{programDegree}</TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>

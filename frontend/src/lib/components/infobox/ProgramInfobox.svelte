<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	import type { ProgramDetail } from '$lib/api/program';
	import { isUndergraduate } from '$lib/utils/programUtils';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';

	export let program: ProgramDetail;

	$: programDegree = isUndergraduate(program) ? "Bachelor's" : program.degree || '-';
</script>

{#if program.is_defunct}
	<Alert color="red" class="mb-4">
		<InfoCircleSolid slot="icon" class="w-5 h-5" />
		This program is defunct and no longer accepting applications.
	</Alert>
{/if}

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
					{#each program.schools.sort((a, b) => a.name.localeCompare(b.name)) as school}
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

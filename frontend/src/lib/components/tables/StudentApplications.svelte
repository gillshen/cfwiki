<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		A
	} from 'flowbite-svelte';

	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	import type { ApplicationListItem } from '$lib/api/application';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let applications: ApplicationListItem[];
</script>

<Table class="mt-8">
	<TableHead>
		<TableHeadCell></TableHeadCell>
		<TableHeadCell>Year</TableHeadCell>
		<TableHeadCell>Type</TableHeadCell>
		<TableHeadCell>School</TableHeadCell>
		<TableHeadCell>Program/Major</TableHeadCell>
		<TableHeadCell>Round</TableHeadCell>
		<TableHeadCell>Due</TableHeadCell>
		<TableHeadCell>Status</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each applications as appl}
			<TableBodyRow>
				<TableBodyCell class="w-4 pl-0">
					<A href={`/application/${appl.id}`}>
						<ArrowUpRightFromSquareOutline />
					</A>
				</TableBodyCell>
				<TableBodyCell class="font-normal">{appl.program_iteration.year}</TableBodyCell>
				<TableBodyCell class="font-normal">{appl.program.type}</TableBodyCell>
				<TableBodyCell class="w-fit max-w-48 truncate">
					{appl.schools.map((s) => s.name).join(' + ')}
				</TableBodyCell>
				<TableBodyCell class="font-normal max-w-44 truncate">
					{appl.program.display_name}
				</TableBodyCell>
				<TableBodyCell class="font-normal">{appl.round.name}</TableBodyCell>
				<TableBodyCell class="font-normal">
					{toShortDate(appl.round.due_date) || '-'}
				</TableBodyCell>
				<TableBodyCell class="">{appl.latest_log?.status ?? '-'}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

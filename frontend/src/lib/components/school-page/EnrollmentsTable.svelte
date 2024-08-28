<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		A
	} from 'flowbite-svelte';

	import type { EnrollmentListItem } from '$lib/api/enrollment';
	import PlainCell from '$lib/components/table-cells/PlainCell.svelte';
	import ShortYearMonth from '$lib/components/table-cells/ShortYearMonth.svelte';
	import { orderByDateDesc } from '$lib/utils/enrollmentUtils';

	export let enrollments: EnrollmentListItem[];
	export let schoolType: string;
</script>

<Table divClass="mt-6" hoverable={enrollments.length > 1}>
	<TableHead>
		<TableHeadCell class="pl-2"></TableHeadCell>
		<TableHeadCell>Start date</TableHeadCell>
		<TableHeadCell>End date</TableHeadCell>
		<TableHeadCell>
			{schoolType === 'Secondary School' ? 'Curriculum' : 'Majors and minors'}
		</TableHeadCell>
		<TableHeadCell>Contract in effect</TableHeadCell>
	</TableHead>

	<TableBody>
		{#each enrollments.sort(orderByDateDesc) as enrollment}
			<TableBodyRow>
				<TableBodyCell class="pl-2">
					<A href={`/student/${enrollment.student.id}`}>{enrollment.student.fullname}</A>
				</TableBodyCell>
				<ShortYearMonth date={enrollment.start_date} />
				<ShortYearMonth date={enrollment.end_date} />
				<PlainCell text={enrollment.curriculum} />
				<TableBodyCell>
					{#if enrollment.student.latest_contract.status === 'In effect'}
						<span class="text-green-500">Yes</span>
					{:else}
						<span class="text-gray-500">No</span>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

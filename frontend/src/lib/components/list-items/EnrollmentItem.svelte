<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TimelineItem, P } from 'flowbite-svelte';

	import type { Enrollment } from '$lib/api/student';
	import { groupGradesByProgressonTerm } from '$lib/api/grade';
	import { toShortYearMonth } from '$lib/utils/dateUtils';

	export let enrollment: Enrollment;

	const formatDateWithProgression = (date: string | null, progression: string): string => {
		const formattedDate = toShortYearMonth(date);
		if (formattedDate && progression) {
			return `${formattedDate} (${progression})`;
		} else {
			return formattedDate || progression;
		}
	};

	const formatDateRange = (e: Enrollment): string => {
		const startDate = formatDateWithProgression(e.start_date, e.start_progression);
		const endDate = formatDateWithProgression(e.end_date, e.end_progression);
		return `${startDate} \u2013 ${endDate}`.trim();
	};
</script>

<TimelineItem
	title={enrollment.school.name}
	date={formatDateRange(enrollment)}
	classLi="bg-slate-50 px-8 pt-4 pb-6 my-0 rounded-xl"
>
	{#if enrollment.curriculum}
		<P size="sm" class="py-3">
			{enrollment.program_type === 'Secondary School' ? 'Curriculum: ' : ''}{enrollment.curriculum}
		</P>
	{/if}

	{#if enrollment.grades.length}
		<Table divClass="mt-2">
			<TableBody>
				{#each Object.entries(groupGradesByProgressonTerm(enrollment.grades)) as [key, grades]}
					<TableBodyRow class="bg-transparent">
						<TableBodyCell class="text-gray-400 px-0 w-24 align-top">
							{key}
						</TableBodyCell>
						<TableBodyCell class="text-gray-400 font-normal">
							<div class="flex flex-col gap-2">
								{#each grades as grade}
									<div>
										<span class="font-medium text-gray-800">{grade.value}</span><span
											>&nbsp;/&nbsp;{grade.scale}{grade.is_cumulative ? ' cumul.' : ''}</span
										>
									</div>
								{/each}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}

	<slot />
</TimelineItem>

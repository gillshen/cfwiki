<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TimelineItem, P } from 'flowbite-svelte';

	import type { EnrollmentByStudent } from '$lib/api/enrollment';
	import GradeValueItem from '$lib/components/list-items/GradeValueItem.svelte';
	import { groupByProgressionTerm } from '$lib/utils/gradesUtils';
	import { toShortYearMonth } from '$lib/utils/dateUtils';
	import { parseNum } from '$lib/utils/numUtils';

	export let enrollment: EnrollmentByStudent;

	const formatDateWithProgression = (date: string | null, progression: string): string => {
		const formattedDate = toShortYearMonth(date);
		if (formattedDate && progression) {
			return `${formattedDate} (${progression})`;
		} else {
			return formattedDate || progression;
		}
	};

	const formatDateRange = (e: EnrollmentByStudent): string => {
		const startDate = formatDateWithProgression(e.start_date, e.start_progression);
		const endDate = formatDateWithProgression(e.end_date, e.end_progression);
		return `${startDate} \u2013 ${endDate}`.trim();
	};
</script>

<TimelineItem
	title={enrollment.school.name}
	date={formatDateRange(enrollment)}
	classLi="bg-stone-50 px-8 pt-4 pb-6 my-0 rounded-xl"
>
	{#if enrollment.curriculum}
		<P size="sm" class="py-3">
			{enrollment.program_type === 'Secondary School' ? 'Curriculum: ' : ''}{enrollment.curriculum}
		</P>
	{/if}

	{#if enrollment.grades.length}
		<Table divClass="mt-2">
			<TableBody>
				{#each Object.entries(groupByProgressionTerm(enrollment.grades)) as [key, grades]}
					<TableBodyRow class="bg-transparent">
						<TableBodyCell class="text-gray-600 px-0 w-24 align-top">
							{key}
						</TableBodyCell>
						<TableBodyCell class="text-gray-400 font-normal">
							<div class="flex flex-col gap-2">
								{#each grades as grade}
									<div class="text-gray-800 flex gap-1">
										{#if parseNum(grade.scale)}
											<GradeValueItem value={grade.value} scale={grade.scale} />
										{:else}
											<div class="truncate w-[11rem]">{grade.comments}</div>
										{/if}
										<span class="text-gray-400">{grade.is_cumulative ? ' (cumul)' : ''}</span>
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

<script lang="ts">
	import type { StudentOfCferListItem } from '$lib/api/student';
	import { isCurrentForUser } from '$lib/util/studentUtils';
	import SubList from './SubList.svelte';

	export let username: string;
	export let students: StudentOfCferListItem[];
	export let selectedStudentId: number | undefined = undefined;

	const currentStudents = students.filter((student) => isCurrentForUser({ student, username }));
	const pastStudents = students.filter((student) => !isCurrentForUser({ student, username }));

	const groupByTargetYear = (
		students: StudentOfCferListItem[]
	): Record<string, StudentOfCferListItem[]> => {
		const result: Record<string, StudentOfCferListItem[]> = {};

		for (const student of students) {
			for (const contract of student.contracts) {
				const key = contract.target_year.toString();
				for (const service of contract.services) {
					if (service.cf_username !== username) {
						continue;
					}
					// matched service found
					if (!result[key]) {
						result[key] = [];
					}
					if (!result[key].includes(student)) {
						result[key].push(student);
					}
				}
			}
		}

		return result;
	};

	const sortCohortsDesc = (
		cohorts: Record<string, StudentOfCferListItem[]>
	): [string, StudentOfCferListItem[]][] =>
		Object.entries(cohorts).sort(([yearA], [yearB]) => yearB.localeCompare(yearA));
</script>

<div class="flex flex-col gap-2">
	<div class="font-bold text-sm">Current Students</div>
	{#if currentStudents.length}
		<div class="flex flex-col gap-2">
			{#each sortCohortsDesc(groupByTargetYear(currentStudents)) as [year, students]}
				<SubList {students} {year} {selectedStudentId} />
			{/each}
		</div>
	{:else}
		<div class="text-muted-foreground">None</div>
	{/if}

	{#if pastStudents.length}
		<div class="font-bold text-sm pt-2">Past Students</div>
		<div class="flex flex-col gap-2">
			{#each sortCohortsDesc(groupByTargetYear(pastStudents)) as [year, students]}
				<SubList {students} {year} {selectedStudentId} open={false} />
			{/each}
		</div>
	{/if}
</div>

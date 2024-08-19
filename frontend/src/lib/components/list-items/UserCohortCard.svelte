<script lang="ts">
	import { A, Heading, Badge } from 'flowbite-svelte';

	import type { CohortMember } from '$lib/api/student';
	import { orderByStatusName } from '$lib/utils/studentUtils';

	export let contractType: string;
	export let cohort: CohortMember[];

	const sortedCohort = cohort.sort(orderByStatusName);
	const currentStudents = sortedCohort.filter((item) => item.current);
	const pastStudents = sortedCohort.filter((item) => !item.current);
</script>

<div class="flex flex-col w-full h-fit px-4 py-6 bg-stone-50 rounded-xl overflow-x-hidden">
	<Heading tag="h3" class="flex items-center gap-2 ml-6 w-fit text-xl font-medium">
		{contractType}
		{#if currentStudents.length}
			<Badge>{currentStudents.length}</Badge>
		{/if}
		{#if pastStudents.length}
			<Badge color="dark">{pastStudents.length}</Badge>
		{/if}
	</Heading>

	<hr class="mx-6 mt-2 mb-4" />

	<div class="flex flex-col gap-6 mx-6 mb-2">
		{#if currentStudents.length}
			<div class="flex flex-col gap-2">
				{#each currentStudents as { student }}
					<A href={`/student/${student.id}`} class="w-fit text-gray-900 hover:text-primary-700">
						{student.fullname}
					</A>
				{/each}
			</div>
		{/if}

		{#if pastStudents.length}
			<div class="flex flex-col gap-2">
				{#each pastStudents as { student }}
					<A href={`/student/${student.id}`} class="w-fit text-gray-500">
						{student.fullname}
					</A>
				{/each}
			</div>
		{/if}
	</div>
</div>

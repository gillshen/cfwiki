<script lang="ts">
	import { Heading, Badge } from 'flowbite-svelte';

	import type { CohortMember } from '$lib/api/student';
	import { orderByStatusName } from '$lib/utils/studentUtils';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';

	export let contractType: string;
	export let cohort: CohortMember[];

	const sortedCohort = cohort.sort(orderByStatusName);
	const currentStudents = sortedCohort.filter((item) => item.current);
	const pastStudents = sortedCohort.filter((item) => !item.current);
</script>

<div
	class="flex flex-col w-full h-fit px-4 py-6 rounded-xl overflow-x-hidden shadow-md bg-stone-50"
>
	<Heading
		tag="h3"
		class="flex items-center gap-2 ml-6 w-fit text-lg tracking-wide text-gray-700 font-normal section-title"
	>
		{contractType}
		<div class="flex gap-1">
			{#if currentStudents.length}
				<Badge>{currentStudents.length}</Badge>
			{/if}
			{#if pastStudents.length}
				<Badge color="dark">{pastStudents.length}</Badge>
			{/if}
		</div>
	</Heading>

	<hr class="mx-6 mt-2 mb-4" />

	<div class="flex flex-col gap-4 mx-6 mb-2">
		{#if currentStudents.length}
			<div class="flex flex-col gap-2">
				{#each currentStudents as { student }}
					<LinkWithIcon href={`/student/${student.id}`} text={student.fullname} iconFirst={true} />
				{/each}
			</div>
		{/if}

		{#if pastStudents.length}
			<div class="flex flex-col gap-2">
				{#each pastStudents as { student }}
					<LinkWithIcon
						href={`/student/${student.id}`}
						text={student.fullname}
						iconFirst={true}
						spanClass="text-gray-500"
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>

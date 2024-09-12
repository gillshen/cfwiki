<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	import type { StudentDetail } from '$lib/api/student';
	import AcademyProgramItems from '$lib/components/list-items/AcademyProgramItems.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import GotoButton from '$lib/components/buttons/GotoButton.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean;
</script>

<Heading tag="h2" class="section-title">CF Academy</Heading>

{#if student.cf_academy_programs.length}
	<div class="flex flex-col gap-3 mt-6 text-sm">
		<AcademyProgramItems programs={student.cf_academy_programs} />
	</div>
{:else if !canEdit}
	<NoDataSign text="None" divClass="mt-6" />
{/if}

{#if canEdit}
	<div class="mt-6">
		<GotoButton href={`/student/${student.id}/cf-academy`} text="Manage Academy Programs" />
	</div>
{/if}

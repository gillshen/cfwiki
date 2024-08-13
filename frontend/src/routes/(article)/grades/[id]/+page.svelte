<script lang="ts">
	import {
		Heading,
		Hr,
		A,
		Button,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import type { Grade } from '$lib/api/grade';
	import { groupGradesByProgressionTerm } from '$lib/api/grade.js';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import GradeForm from '$lib/components/grade-form/GradeForm.svelte';
	import GradeValueItem from '$lib/components/list-items/GradeValueItem.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import Comments from '$lib/components/typography/Comments.svelte';

	export let data;

	$: groupedGrades = groupGradesByProgressionTerm(data.enrollment.grades);

	let gradeModal = false;
	let activeGrade: Grade | null = null;

	const modalOpener = (grade?: Grade): (() => void) => {
		return () => {
			activeGrade = grade ?? null;
			gradeModal = true;
		};
	};

	const placeHolder = '-';
</script>

<Heading tag="h1" class="alt-page-title">
	<A href={`/student/${data.enrollment.student.id}`}>{data.enrollment.student.fullname}</A>
	@ {data.enrollment.school.name}
</Heading>

<Hr />

{#if data.enrollment.grades.length}
	<section class="w-[48rem] min-w-[32rem] flex flex-col">
		<Table>
			<TableHead>
				<TableHeadCell class="pl-2">Year</TableHeadCell>
				<TableHeadCell>Period</TableHeadCell>
				<TableHeadCell>Grade</TableHeadCell>
				<TableHeadCell>Cumulative</TableHeadCell>
				<TableHeadCell>Comments</TableHeadCell>
				<TableHeadCell></TableHeadCell>
			</TableHead>
			<TableBody>
				{#each Object.values(groupedGrades) as grades}
					{#each grades as grade}
						<TableBodyRow>
							<TableBodyCell class="pl-2 w-16 align-top">{grade.progression}</TableBodyCell>

							<TableBodyCell class="w-24 font-normal align-top">{grade.term}</TableBodyCell>

							<TableBodyCell class="w-24 align-top">
								<GradeValueItem value={grade.value} scale={grade.scale} />
							</TableBodyCell>

							<TableBodyCell class="font-normal w-16 align-top">
								{grade.is_cumulative ? 'Yes' : placeHolder}
							</TableBodyCell>

							<TableBodyCell class="font-normal w-full">
								{#if grade.comments}
									<Comments text={grade.comments} divClass="pr-4" />
								{:else}
									{placeHolder}
								{/if}
							</TableBodyCell>

							<TableBodyCell class="w-8 align-top">
								<UpdateDeleteButton
									updateAction={modalOpener(grade)}
									deleteAction={() => alert('delete')}
								/>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/each}
			</TableBody>
		</Table>
	</section>
{/if}

<Button class="mt-8" on:click={modalOpener()}>Add a grade</Button>

<FormModal
	open={gradeModal}
	superform={data.gradeForm}
	fields={GradeForm}
	entity={activeGrade}
	action="?/createOrUpdateGrade"
	extra={[{ name: 'enrollment', type: 'number', value: data.enrollment.id }]}
	title={`${activeGrade ? 'Update' : 'Add a'} grade`}
	on:close={() => (gradeModal = false)}
/>

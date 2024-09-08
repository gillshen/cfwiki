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
		TableHeadCell,
		Breadcrumb,
		BreadcrumbItem
	} from 'flowbite-svelte';

	import type { Grade } from '$lib/api/grade';
	import { groupByProgressionTerm } from '$lib/utils/gradesUtils';

	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import GradeForm from '$lib/components/grade-form/GradeForm.svelte';
	import GradeValueItem from '$lib/components/list-items/GradeValueItem.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import Comments from '$lib/components/typography/Comments.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';

	export let data;

	$: canEdit = data.staffList.includes(data.username);
	$: groupedGrades = groupByProgressionTerm(data.enrollment.grades);

	let gradeModal = false;
	let gradeDeleteModal = false;
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
	{data.enrollment.student.fullname} @ {data.enrollment.school.name}
</Heading>

<Hr />

<Breadcrumb class="mb-8">
	<BreadcrumbLink
		text={data.enrollment.student.fullname}
		href={`/student/${data.enrollment.student.id}`}
	/>
	<BreadcrumbItem>Education: {data.enrollment.school.name}</BreadcrumbItem>
</Breadcrumb>

{#if data.enrollment.grades.length}
	<section class="flex flex-col">
		<Table hoverable={data.enrollment.grades.length > 1}>
			<TableHead>
				<TableHeadCell class="pl-2">Year</TableHeadCell>
				<TableHeadCell>Period</TableHeadCell>
				<TableHeadCell>Grade</TableHeadCell>
				<TableHeadCell>Weighted</TableHeadCell>
				<TableHeadCell>Cumulative</TableHeadCell>
				<TableHeadCell>Comments</TableHeadCell>
				<TableHeadCell></TableHeadCell>
			</TableHead>
			<TableBody>
				{#each Object.values(groupedGrades) as grades}
					{#each grades as grade}
						<TableBodyRow>
							<TableBodyCell class="pl-2 min-w-24">{grade.progression}</TableBodyCell>

							<TableBodyCell class="font-normal min-w-32">{grade.term}</TableBodyCell>

							<TableBodyCell class="min-w-32">
								<GradeValueItem value={grade.value} scale={grade.scale} />
							</TableBodyCell>

							<TableBodyCell class="font-normal min-w-24">
								{grade.is_weighted ? 'Yes' : placeHolder}
							</TableBodyCell>

							<TableBodyCell class="font-normal min-w-24">
								{grade.is_cumulative ? 'Yes' : placeHolder}
							</TableBodyCell>

							<TableBodyCell class="font-normal w-full">
								{#if grade.comments}
									<Comments text={grade.comments} divClass="pr-4" />
								{:else}
									{placeHolder}
								{/if}
							</TableBodyCell>

							<TableBodyCell class="w-8">
								{#if canEdit}
									<UpdateDeleteButton
										updateAction={modalOpener(grade)}
										deleteAction={() => {
											activeGrade = grade;
											gradeDeleteModal = true;
										}}
									/>
								{/if}
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				{/each}
			</TableBody>
		</Table>
	</section>
{:else}
	<NoDataSign text="No grades" />
{/if}

{#if canEdit}
	<Button class="mt-8" on:click={modalOpener()} outline>Add a GPA</Button>
{/if}

<FormModal
	open={gradeModal}
	superform={data.gradeForm}
	fields={GradeForm}
	entity={activeGrade}
	action="?/createOrUpdateGrade"
	extra={[{ name: 'enrollment', type: 'number', value: data.enrollment.id }]}
	title={`${activeGrade ? 'Update' : 'Add a'} GPA`}
	on:close={() => (gradeModal = false)}
/>

<FormModal
	open={gradeDeleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	entity={activeGrade}
	action="?/deleteGrade"
	title="Delete grade"
	on:close={() => {
		gradeDeleteModal = false;
	}}
>
	<DeleteMessage
		slot="preface"
		name={`this grade (${activeGrade?.progression} ${activeGrade?.term}, ${activeGrade?.is_cumulative ? 'cumulative' : 'non-cumulative'})`}
	/>
</FormModal>

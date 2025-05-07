<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Table from '$lib/components/ui/table/index';
	import Calendar from 'lucide-svelte/icons/calendar';
	import GraduationCap from 'lucide-svelte/icons/graduation-cap';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import PencilEditButton from '$lib/components/misc/PencilEditButton.svelte';
	import EnrollmentForm from '$lib/components/forms/enrollment-form/EnrollmentUpdateForm.svelte';
	import GradeForm from '$lib/components/forms/GradeForm.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';

	import { createTitle } from '$lib/util/siteUtils';
	import { formatEnrollmentDates } from '$lib/util/enrollmentUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';
	import { formatGrade, parseNumber } from '$lib/util/gradeUtils';

	import { SECONDARY_PROGRESSIONS, UNIVERSITY_PROGRESSIONS } from '$lib/constants/progressions';

	export let data;

	const progressions =
		data.enrollment.program_type === 'Secondary School'
			? SECONDARY_PROGRESSIONS
			: UNIVERSITY_PROGRESSIONS;

	let enrollmentUpdateModal = false;
	let newGradeModal = false;
	let enrollmentDeleteModal = false;

	$: hasGrades = !!data.enrollment.grades.length;
</script>

<svelte:head>
	<title>{createTitle(`${data.student.fullname} @ ${data.enrollment.school.name}`)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page
			>@ {data.enrollment.school.alt_name || data.enrollment.school.name}</Breadcrumb.Page
		>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2 pb-4">
	<h1 class="page-title flex items-center gap-1">
		{data.student.fullname}
		<span class="scale-[80%]">@</span>
		{data.enrollment.school.name}
	</h1>
	<div class="flex flex-col gap-2 text-sm">
		<div class="flex items-center gap-1.5">
			<Calendar class="size-4" />
			{formatEnrollmentDates(data.enrollment, toShortYearMonth)}
		</div>
		{#if data.enrollment.curriculum}
			<div class="flex items-center gap-1.5">
				<GraduationCap class="size-4" />
				<div>{data.enrollment.curriculum}</div>
			</div>
		{/if}
		<div class="=w-fit -mt-2">
			<ButtonDialog
				buttonSlot
				dialogTitle="Update Educational Experience"
				bind:open={enrollmentUpdateModal}
			>
				<PencilEditButton slot="button" class="p-0 m-0" iconClass="mr-1.5" />
				<EnrollmentForm
					data={data.enrollmentForm}
					enrollment={{ ...data.enrollment, school: data.enrollment.school.id }}
					onUpdated={({ form }) => form.valid && (enrollmentUpdateModal = false)}
				/>
			</ButtonDialog>
		</div>
	</div>
</section>

<Section id="grades">
	<Card.Root class={cn('shadow-none', hasGrades ? 'w-fit' : 'w-[450px]')}>
		<Card.Header>
			<Card.Title class="tracking-normal">Grades</Card.Title>
			{#if !hasGrades}
				<Card.Description><p class="text-balance">None has been reported yet.</p></Card.Description>
			{/if}
		</Card.Header>
		<Card.Content class="min-h-[160px] flex">
			{#if hasGrades}
				<Table.Root class="w-[744px]">
					<Table.Header>
						<Table.Row>
							<Table.Head class="font-semibold">Year</Table.Head>
							<Table.Head class="font-semibold">Period</Table.Head>
							<Table.Head class="font-semibold">GPA or Description</Table.Head>
							<Table.Head class="font-semibold">Weighted</Table.Head>
							<Table.Head class="font-semibold">Cumul.</Table.Head>
							<Table.Head class="font-semibold w-[90px] flex-grow-0"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.enrollment.grades as grade}
							<Table.Row>
								<Table.Cell>{grade.progression}</Table.Cell>
								<Table.Cell>{grade.term}</Table.Cell>
								<Table.Cell class="tabular-nums max-w-[320px]">{formatGrade(grade)}</Table.Cell>
								<Table.Cell>
									{#if grade.is_weighted}
										<Check class="size-4" />
									{:else if parseNumber(grade.scale)}
										<X class="size-4" />
									{:else}
										<span class="text-muted-foreground">n/a</span>
									{/if}
								</Table.Cell>
								<Table.Cell>
									<svelte:component this={grade.is_cumulative ? Check : X} class="size-4" />
								</Table.Cell>
								<Table.Cell>actionItem</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<ButtonDialog
					buttonVariant="default"
					buttonText="Report Grade"
					dialogTitle="Report Grade"
					buttonClass="w-fit m-auto"
					bind:open={newGradeModal}
				>
					<GradeForm
						data={data.gradeForm}
						enrollmentId={data.enrollment.id}
						progressions={[...progressions]}
						onUpdated={({ form }) => form.valid && (newGradeModal = false)}
					/>
				</ButtonDialog>
			{/if}
		</Card.Content>
		{#if hasGrades}
			<Card.Footer>
				<ButtonDialog
					buttonVariant="outline"
					buttonText="Report Grade"
					dialogTitle="Report Grade"
					buttonClass="w-fit mt-2"
					bind:open={newGradeModal}
				>
					<GradeForm
						data={data.gradeForm}
						enrollmentId={data.enrollment.id}
						progressions={[...progressions]}
						onUpdated={({ form }) => form.valid && (newGradeModal = false)}
					/>
				</ButtonDialog>
			</Card.Footer>
		{/if}
	</Card.Root>
</Section>

<Section id="delete" class="mt-auto">
	<ButtonDialog
		buttonText="Delete Experience"
		buttonVariant="destructive"
		buttonClass="w-fit"
		dialogTitle="Delete this educational experience?"
		bind:open={enrollmentDeleteModal}
	>
		<p slot="description" class="text-pretty">
			Deletion is instant and permanent. It will also cause all the associated grades to be
			instantly and permanently deleted.
		</p>
		<DeleteForm
			data={data.deleteForm}
			objectId={data.enrollment.id}
			action="?/deleteEnrollment"
			onUpdated={({ form }) => form.valid && (enrollmentDeleteModal = false)}
			onCancel={() => (enrollmentDeleteModal = false)}
		/>
	</ButtonDialog>
</Section>

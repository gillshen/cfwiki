<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Pencil from 'lucide-svelte/icons/pencil-line';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import CoApplicationsDisplay from '$lib/components/widgets/CoApplicationsDisplay.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';
	import countryFlags from '$lib/constants/countries';

	import {
		formatLocation,
		formatSchoolRankingEntry,
		getSchoolRankingEntry
	} from '$lib/util/schoolUtils';

	import { groupByCategory, enhanceDisplayName } from '$lib/util/programUtils';
	import { filterByType } from '$lib/util/applicationUtils';
	import { toISOYearMonth } from '$lib/util/dateUtils';
	import { orderByDatesDesc } from '$lib/util/enrollmentUtils';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	$: usNewsRank = formatSchoolRankingEntry(
		getSchoolRankingEntry({ school: data.school, rankingName: 'US News' })
	);
	$: qsRank = formatSchoolRankingEntry(
		getSchoolRankingEntry({ school: data.school, rankingName: 'QS World' })
	);

	let schoolFormOpen = false;

	const schoolForm = superForm(data.schoolForm, {
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				console.log(form);
				schoolFormOpen = false;
			}
		}
	});
	const { enhance: schoolFormEnhance } = schoolForm;
</script>

<svelte:head>
	<title>{createTitle(data.school.name)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/school/index">Schools</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{data.school.alt_name}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-4 space-y-2">
	<h1 class="page-title">{data.school.name}</h1>
	<div class="flex flex-row gap-2 items-center text-sm">
		{#if data.school.alt_name}
			<div>{data.school.alt_name}</div>
			<div class="text-gray-400">&bullet;</div>
		{/if}
		<div>{countryFlags[data.school.country]}</div>
		<div>{formatLocation(data.school)}</div>
		{#if data.school.type === 'University' && (usNewsRank || qsRank)}
			<div class="ml-2 flex flex-row gap-1">
				{#if usNewsRank}
					<Badge variant="secondary">{usNewsRank}</Badge>
				{/if}
				{#if qsRank}
					<Badge variant="secondary">{qsRank}</Badge>
				{/if}
			</div>
		{/if}
		{#key data.school}
			<ButtonDialog
				buttonVariant="link"
				buttonSize="sm"
				buttonText="Edit"
				buttonClass="font-normal text-muted-foreground hover:no-underline hover:text-primary"
				buttonIcon={Pencil}
				buttonIconClass="size-4 mr-1"
				contentClass="min-w-[529px]"
				dialogTitle="Edit School Profile"
				open={schoolFormOpen}
			>
				<form
					method="POST"
					action="?/updateSchool"
					class="flex flex-col gap-4 items-start justify-start"
					use:schoolFormEnhance
					id="school-form"
				>
					<SchoolForm form={schoolForm} hideSchoolType />
				</form>
			</ButtonDialog>
		{/key}
	</div>
</section>

{#if data.school.type !== 'Secondary School'}
	<Section id="programs" title="Programs">
		{#await data.programs}
			<LoadingSign />
		{:then programs}
			{#if programs.length}
				<div class="flex flex-col gap-4">
					{#each groupByCategory(programs) as [category, filteredPrograms]}
						{#if filteredPrograms.length}
							<div class="flex flex-col gap-2">
								<h4 class="text-base font-bold">{category}</h4>
								{#each filteredPrograms as program}
									<a class="w-fit" href="/program/{program.id}">{enhanceDisplayName(program)}</a>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		{/await}
	</Section>

	{#await data.applications}
		<LoadingSign class="mb-8" />
	{:then applications}
		{#if filterByType(applications, 'UG Freshman').length}
			<Section id="ug-freshman-applications" title="UG Freshman Applications">
				<!-- TODO year filter and sorting options -->
				<CoApplicationsDisplay applications={filterByType(applications, 'UG Freshman')} />
			</Section>
		{/if}

		{#if filterByType(applications, 'UG Transfer').length}
			<Section id="ug-transfer-applications" title="UG Transfer Applications">
				<!-- TODO year filter and sorting options -->
				<CoApplicationsDisplay applications={filterByType(applications, 'UG Transfer')} />
			</Section>
		{/if}

		{#if filterByType(applications, 'Graduate').length}
			<Section id="graduate-applications" title="Graduate Applications">
				<!-- TODO year filter and sorting options -->
				<CoApplicationsDisplay applications={filterByType(applications, 'Graduate')} showPrograms />
			</Section>
		{/if}
	{/await}
{/if}

{#await data.enrollments}
	<LoadingSign />
{:then enrollments}
	{#if enrollments.length}
		<Section id="students-and-alumni" title="Students & Alumni">
			<div class="flex flex-col gap-2">
				{#each enrollments.sort(orderByDatesDesc) as enrollment}
					{@const student = enrollment.student}
					<a href="/student/{student.id}" class="inline-block w-fit">
						<span class="text-primary">{student.fullname}</span>
						<span class="mx-1">@</span>
						<span class="tabular-nums">
							{toISOYearMonth(enrollment.start_date)} &ndash; {toISOYearMonth(
								enrollment.end_date
							) ?? '?'}
						</span>
					</a>
				{/each}
			</div>
		</Section>
	{/if}
{/await}

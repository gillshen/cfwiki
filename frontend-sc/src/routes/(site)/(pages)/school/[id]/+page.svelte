<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import CoApplicationsDisplay from '$lib/components/widgets/CoApplicationsDisplay.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import countryFlags from '$lib/constants/countries';
	import { formatLocation, formatRanking, getLatestRanking } from '$lib/util/schoolUtils';
	import { categorizeAndSort, enhanceDisplayName } from '$lib/util/programUtils';
	import { filterByType } from '$lib/util/applicationUtils';

	export let data;

	$: usNewsRank = formatRanking(getLatestRanking(data.school, { rankingName: 'US News' }), {
		year: false
	});
	$: qsRank = formatRanking(getLatestRanking(data.school, { rankingName: 'QS World' }), {
		year: false
	});
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/school/index">Schools</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{data.school.alt_name}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2">
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
					<Badge variant="secondary">US News #{usNewsRank}</Badge>
				{/if}
				{#if qsRank}
					<Badge variant="secondary">QS #{qsRank}</Badge>
				{/if}
			</div>
		{/if}
		<Button variant="link" class="ml-2">
			<Pencil class="mr-1 h-3 w-3" />Edit
		</Button>
	</div>
</section>

{#if data.school.type !== 'Secondary School'}
	<Section id="programs" title="Programs">
		{#await data.programs}
			<LoadingSign />
		{:then programs}
			{#if programs.length}
				<div class="flex flex-col">
					{#each categorizeAndSort(programs) as [_, filteredPrograms], index}
						{#if index}
							<hr class="text-stone-400 w-4 my-3" />
						{/if}
						<div class="flex flex-col gap-2">
							{#each filteredPrograms as program}
								<a class="w-fit" href={`/program/${program.id}`}>{enhanceDisplayName(program)}</a>
							{/each}
						</div>
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

<Section id="students-and-alumni" title="Students & Alumni">
	<!-- TODO -->
</Section>

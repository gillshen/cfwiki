<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';

	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import countryFlags from '$lib/constants/countries';
	import { formatLocation, formatRanking, getLatestRanking } from '$lib/util/schoolUtils';
	import { categorizeAndSort, enhanceDisplayName } from '$lib/util/programUtils';

	export let data;

	$: usNewsRank = formatRanking(getLatestRanking(data.school, { rankingName: 'US News' }), {
		year: false
	});
	$: qsRank = formatRanking(getLatestRanking(data.school, { rankingName: 'QS World' }), {
		year: false
	});
</script>

<section class="w-fit min-w-[60ch] mb-2 space-y-2">
	<h1 class="page-title">{data.school.name}</h1>
	<div class="flex flex-row gap-1 items-center text-sm">
		{#if data.school.alt_name}
			<div>{data.school.alt_name}</div>
			<div class="text-stone-400">&bullet;</div>
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
							<hr class="text-stone-400 w-8 my-3" />
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

	<Section id="ug-freshman-applications" title="UG Freshman Applications">
		{#await data.applications}
			<LoadingSign />
		{:then applications}
			<!-- TODO table and year filter -->
			{#each applications.filter((a) => a.program.type === 'UG Freshman') as application}
				<div class="text-stone-800">
					{application.student.fullname} @ {application.majors_or_track || '-'}
				</div>
			{/each}
		{/await}
	</Section>

	<Section id="ug-transfer-applications" title="UG Transfer Applications">
		{#await data.applications}
			<LoadingSign />
		{:then applications}
			<!-- TODO table and year filter -->
			{#each applications.filter((a) => a.program.type === 'UG Transfer') as application}
				<div class="text-stone-800">
					{application.student.fullname} @ {application.majors_or_track || '-'}
				</div>
			{/each}
		{/await}
	</Section>

	<Section id="graduate-applications" title="Graduate Applications">
		{#await data.applications}
			<LoadingSign />
		{:then applications}
			<!-- TODO table and year filter -->
			{#each applications.filter((a) => a.program.type === "Master's" || a.program.type === 'Doctorate') as application}
				<div class="text-stone-800">
					{application.student.fullname} @ {application.program.display_name}
				</div>
			{/each}
		{/await}
	</Section>
{/if}

<Section id="students-and-alumni" title="Students & Alumni">
	<!-- TODO -->
</Section>

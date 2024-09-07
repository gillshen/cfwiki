<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Heading, Hr } from 'flowbite-svelte';
	import { ChartLineUpOutline } from 'flowbite-svelte-icons';

	import ApplicationStatsBars from '$lib/components/application-stats/ApplicationStatsBars.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import { formatSchoolNamesShort } from '$lib/utils/programUtils';

	import {
		compose,
		getStatsByApplicationRound,
		getStatsByGender,
		getStatsByYear
	} from '$lib/utils/applicationUtils';

	export let data;
</script>

<Heading tag="h1" class="alt-page-title flex items-center gap-4">
	<ChartLineUpOutline size="xl" />
	<span>{formatSchoolNamesShort(data.program)} | {data.program.display_name}</span>
</Heading>

<Hr />

<Breadcrumb class="mb-8">
	<BreadcrumbItem href={`/program/${data.program.id}`}>
		<span class="text-primary-700">Back to the Program Page</span>
	</BreadcrumbItem>
</Breadcrumb>

{#await Promise.all([data.applications, data.applicants])}
	<FetchingDataSign />
{:then [applications, applicants]}
	{#if applications.length}
		<div class="bg-stone-50 rounded-xl w-full p-8">
			<ApplicationStatsBars
				aggregatedData={getStatsByYear(compose(applications, applicants))}
				title="By Year"
			/>
		</div>

		<div class="bg-stone-50 rounded-xl w-full p-8 mt-8">
			<ApplicationStatsBars
				aggregatedData={getStatsByGender(compose(applications, applicants))}
				title="By Gender"
			/>
		</div>

		<div class="bg-stone-50 rounded-xl w-full p-8 mt-8">
			<ApplicationStatsBars
				aggregatedData={getStatsByApplicationRound(compose(applications, applicants))}
				title="By Admission Plan"
			/>
		</div>
	{:else}
		<NoDataSign text="Not available" />
	{/if}
{/await}

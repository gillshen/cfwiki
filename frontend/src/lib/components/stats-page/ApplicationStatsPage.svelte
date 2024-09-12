<script lang="ts">
	import { Breadcrumb, Heading, Hr } from 'flowbite-svelte';
	import { ChartLineUpOutline } from 'flowbite-svelte-icons';

	import type { ComposedApplication } from '$lib/api/application';
	import ApplicationStatsBars from '$lib/components/application-stats/ApplicationStatsBars.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';

	import {
		getStatsByApplicationRound,
		getStatsByGender,
		getStatsByYear
	} from '$lib/utils/applicationUtils';

	export let applications: Promise<ComposedApplication[]>;
	export let title: string;
	export let backUrl: string;
	export let backUrlText: string;
</script>

<Heading tag="h1" class="alt-page-title flex items-center gap-4">
	<ChartLineUpOutline size="xl" /><span>{title}</span>
</Heading>

<Hr />

<Breadcrumb class="mb-8">
	<BreadcrumbLink text={backUrlText} href={backUrl} />
</Breadcrumb>

{#await applications}
	<FetchingDataSign />
{:then applications}
	{#if applications.length}
		<div class="bg-stone-50 rounded-xl w-full p-8">
			<ApplicationStatsBars aggregatedData={getStatsByYear(applications)} title="By Year" />
		</div>

		<div class="bg-stone-50 rounded-xl w-full p-8 mt-8">
			<ApplicationStatsBars aggregatedData={getStatsByGender(applications)} title="By Gender" />
		</div>

		<div class="bg-stone-50 rounded-xl w-full p-8 mt-8">
			<ApplicationStatsBars
				aggregatedData={getStatsByApplicationRound(applications)}
				title="By Admission Plan"
			/>
		</div>
	{:else}
		<NoDataSign text="Not available" />
	{/if}
{/await}

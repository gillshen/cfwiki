<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Heading, Hr } from 'flowbite-svelte';
	import { ChartLineUpOutline } from 'flowbite-svelte-icons';

	import type { ApplicantListItem, ApplicationListItem } from '$lib/api/application';
	import ApplicationStatsBars from '$lib/components/application-stats/ApplicationStatsBars.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';

	import {
		compose,
		getStatsByApplicationRound,
		getStatsByGender,
		getStatsByYear
	} from '$lib/utils/applicationUtils';

	export let applications: Promise<ApplicationListItem[]>;
	export let applicants: Promise<ApplicantListItem[]>;
	export let title: string;
	export let backUrl: string;
	export let backUrlText: string;
</script>

<Heading tag="h1" class="alt-page-title flex items-center gap-4">
	<ChartLineUpOutline size="xl" /><span>{title}</span>
</Heading>

<Hr />

<Breadcrumb class="mb-8">
	<BreadcrumbItem href={backUrl}>
		<span class="text-primary-700">{backUrlText}</span>
	</BreadcrumbItem>
</Breadcrumb>

{#await Promise.all([applications, applicants])}
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

<script lang="ts">
	import { Heading, Badge } from 'flowbite-svelte';

	import type { ApplicantListItem, ApplicationListItem } from '$lib/api/application';
	import { compose } from '$lib/utils/applicationUtils';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import FetchingDataErrorSign from '$lib/components/misc/FetchingDataErrorSign.svelte';

	export let applications: Promise<ApplicationListItem[]>;
	export let applicants: Promise<ApplicantListItem[]>;
	export let heading: string = 'Applications';
	export let noDataText: string = 'None';
	export let errorText: string = '';
	export let showHeading: boolean = true;
</script>

{#if showHeading}
	<Heading tag="h2" class="section-title flex-title">
		{heading}
		{#await applications then applications}
			{#if applications.length}
				<div class="relative -top-2 -left-1">
					<Badge class="h-5">{applications.length}</Badge>
				</div>
			{/if}
		{/await}
	</Heading>
{/if}

{#await Promise.all([applications, applicants])}
	<FetchingDataSign divClass="mt-8" />
{:then [applications, applicants]}
	{#if !applications.length}
		<NoDataSign text={noDataText} divClass="mt-6" />
	{:else}
		<slot applications={compose(applications, applicants)} />
	{/if}
{:catch}
	<FetchingDataErrorSign text={errorText} divClass="mt-6" />
{/await}

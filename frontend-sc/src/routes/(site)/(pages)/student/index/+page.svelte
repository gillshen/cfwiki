<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import { CONTRACT_TYPES } from '$lib/api/contract';
	import { formatNameWithPref, orderByName } from '$lib/util/studentUtils';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle('Students')}</title>
</svelte:head>

<BreadcrumbContainer includeHome>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Students</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

{#await data.groupedCohorts}
	<LoadingSign />
{:then groupedCohorts}
	{#each groupedCohorts as { year, cohortGrouped }}
		<Section id="cohort-{year}" title={year} class="gap-2">
			<div class="flex flex-col gap-4">
				{#each CONTRACT_TYPES as contractType}
					{@const typedCohort = cohortGrouped[contractType]}
					{#if typedCohort?.length}
						<hgroup>
							<h3 class="font-semibold pb-2">{contractType}</h3>
							<div class="grid lg:grid-cols-4 md:grid-cols-3 gap-x-4 gap-y-2">
								{#each typedCohort.sort(orderByName) as student}
									<a href="/student/{student.id}" class="text-sm w-fit"
										>{formatNameWithPref(student)}</a
									>
								{/each}
							</div>
						</hgroup>
					{/if}
				{/each}
			</div>
		</Section>
	{/each}
{/await}

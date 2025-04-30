<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import { contractTypes } from '$lib/api/contract';
	import { createTitle } from '$lib/util/siteUtils';

	import {
		formatNameWithPref,
		groupByContractType,
		groupByTargetYear,
		orderByName
	} from '$lib/util/studentUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle('Students')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Students</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

{#await data.students}
	<LoadingSign />
{:then students}
	{#each Object.entries(groupByTargetYear(students)).sort().reverse() as [year, cohort]}
		{@const cohortGroupedByContractType = groupByContractType(cohort, parseInt(year))}
		<Section id="cohort-{year}" title={year}>
			<div class="flex flex-col gap-4">
				{#each contractTypes as contractType}
					{@const typedCohort = cohortGroupedByContractType[contractType]}
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

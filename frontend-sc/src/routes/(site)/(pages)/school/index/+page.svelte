<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import type { SchoolType } from '$lib/api/school';
	import { groupByType, orderByName } from '$lib/util/schoolUtils';
	import { createTitle, scrollToHash } from '$lib/util/siteUtils';

	export let data;

	const schoolTypeToId = (schoolType: SchoolType | string): string => {
		switch (schoolType) {
			case 'University':
				return 'universities';
			case 'Secondary School':
				return 'secondary-schools';
			case 'Other':
				return 'other-institutions';
			default:
				return schoolType;
		}
	};

	const typeToIndex: Record<SchoolType | string, number> = {
		University: 0,
		'Secondary School': 1,
		Other: 2
	};

	const compareSchoolTypes = (a: SchoolType | string, b: SchoolType | string): number =>
		typeToIndex[a] - typeToIndex[b];

	afterNavigate(scrollToHash);
</script>

<svelte:head>
	<title>{createTitle('Schools & Institutions')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Schools</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

{#await data.schools}
	<LoadingSign />
{:then schools}
	{#each Object.entries(groupByType(schools)).sort( ([typeA], [typeB]) => compareSchoolTypes(typeA, typeB) ) as [schoolType, schoolList]}
		{#if schoolList.length}
			<Section id={schoolTypeToId(schoolType)} title={schoolType} class="scroll-mt-[116px]">
				<div class="grid lg:grid-cols-2 md:grid-cols-1 gap-2">
					{#each schoolList.sort(orderByName) as school}
						<a href={`/school/${school.id}`} class="w-fit">{school.name}</a>
					{/each}
				</div>
			</Section>
		{/if}
	{/each}
{/await}

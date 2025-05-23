<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';

	import { SCHOOL_TYPES, type SchoolType } from '$lib/api/school';
	import { orderByName } from '$lib/util/schoolUtils';
	import { createTitle, scrollToHash } from '$lib/util/siteUtils';

	export let data;

	const sectionMap: Record<SchoolType, { id: string; title: string }> = {
		University: { id: 'universities', title: 'Universities' },
		'Secondary School': { id: 'secondary-schools', title: 'Secondary Schools' },
		Other: { id: 'other-institutions', title: 'Other Institutions' }
	};

	afterNavigate(scrollToHash);
</script>

<svelte:head>
	<title>{createTitle('Schools & Institutions')}</title>
</svelte:head>

<BreadcrumbContainer includeHome>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Schools</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

{#await data.schoolsGrouped}
	<LoadingSign />
{:then schoolsGrouped}
	{#each SCHOOL_TYPES as schoolType}
		{@const schools = schoolsGrouped[schoolType]}
		{@const { id, title } = sectionMap[schoolType]}
		{#if schools?.length}
			<Section {id} {title} class="scroll-mt-[92px] gap-2">
				<div class="grid lg:grid-cols-2 md:grid-cols-1 gap-y-2 gap-x-6">
					{#each schools.sort(orderByName) as school}
						<a href="/school/{school.id}" class="w-fit">{school.name}</a>
					{/each}
				</div>
			</Section>
		{/if}
	{/each}
{/await}

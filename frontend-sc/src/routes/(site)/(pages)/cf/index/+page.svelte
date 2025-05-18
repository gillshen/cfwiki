<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import UserDirectory from '$lib/components/widgets/UserDirectory.svelte';
	import { Departments } from '$lib/api/user';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle('People')}</title>
</svelte:head>

<BreadcrumbContainer includeHome>
	<Breadcrumb.Item>
		<Breadcrumb.Page>CF People</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<div class="flex flex-wrap gap-12">
	{#each Object.values(Departments) as department}
		<Section id="dept-wenan" title="{department}部" hruleClass="mb-0">
			<UserDirectory users={data.cfUsers} {department} employmentStatus="current" />

			<h3 class="pt-4 font-medium">Past</h3>
			<UserDirectory users={data.cfUsers} {department} employmentStatus="past" />
		</Section>
	{/each}
</div>

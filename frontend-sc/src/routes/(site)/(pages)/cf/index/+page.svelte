<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import UserDirectory from '$lib/components/widgets/UserDirectory.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle('People')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>CF People</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<div class="grid grid-cols-3 gap-16">
	<Section id="dept-wenan" title="文案部">
		<UserDirectory users={data.cfUsers} department="文案" employmentStatus="current" />

		<h3 class="pt-4 font-medium">Past</h3>
		<UserDirectory users={data.cfUsers} department="文案" employmentStatus="past" />
	</Section>

	<Section id="dept-zixun" title="咨询部">
		<UserDirectory users={data.cfUsers} department="咨询" employmentStatus="current" />

		<h3 class="pt-4 font-medium">Past</h3>
		<UserDirectory users={data.cfUsers} department="咨询" employmentStatus="past" />
	</Section>
</div>

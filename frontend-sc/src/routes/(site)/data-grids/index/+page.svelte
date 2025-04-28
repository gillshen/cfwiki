<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import { createTitle } from '$lib/util/siteUtils';
</script>

<svelte:head>
	<title>{createTitle('Data Center')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Data Grids</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<Section id="students" title="Students">(TODO)</Section>

<Section id="applications" title="Applications">(TODO)</Section>

<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import CoApplicationsDisplay from '$lib/components/widgets/CoApplicationsDisplay.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import { createTitle } from '$lib/util/siteUtils';
	import { joinNames } from '$lib/util/schoolUtils';

	export let data;

	const schoolNames = joinNames(data.program.schools, { alt: true });
	const title = `${schoolNames} | ${data.program.display_name}`;
</script>

<svelte:head>
	<title>{createTitle(title)}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/program/index">Programs</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{title}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<pre class="text-sm bg-gray-100 rounded-md p-4 mb-4">{JSON.stringify(data.program, null, 2)}</pre>

<Section id="applications" title="Applications">
	{#await data.applications}
		<LoadingSign />
	{:then applications}
		<CoApplicationsDisplay {applications} />
	{/await}
</Section>

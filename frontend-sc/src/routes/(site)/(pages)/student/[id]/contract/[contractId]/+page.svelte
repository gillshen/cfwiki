<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const { student, contract } = data;
</script>

<svelte:head>
	<title>{createTitle(`${student.fullname} \u2022 ${contract.type} ${contract.target_year}`)}</title
	>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	<Breadcrumb.Separator />
	<Breadcrumb.Link href="/student/{student.id}">{student.fullname}</Breadcrumb.Link>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>Contract: {contract.type} {contract.target_year}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title flex gap-2 mb-2">
	<div>{student.fullname}</div>
	<div>&bullet;</div>
	<div>{contract.type} {contract.target_year}</div>
</h1>

<section class="pb-8">
	<pre class="text-sm p-4 rounded-lg bg-muted max-w-prose">{JSON.stringify(
			{ ...contract, services: 'see below' },
			null,
			2
		)}</pre>
</section>

<Section id="personnel" title="Personnel">
	{#each contract.services as service}
		<pre class="text-sm p-4 rounded-lg bg-muted max-w-prose">{JSON.stringify(
				service,
				null,
				2
			)}</pre>
	{/each}
</Section>

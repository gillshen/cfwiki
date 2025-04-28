<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';

	export let data;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Link href={`/student/index`}>Students</Breadcrumb.Link>
	<Breadcrumb.Separator />
	<Breadcrumb.Link href={`/student/${data.contract.student}`}
		>{data.contract.student_name}</Breadcrumb.Link
	>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>Contract: {data.contract.type} {data.contract.target_year}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="pb-8">
	<pre class="text-sm p-4 rounded-lg bg-zinc-100">{JSON.stringify(
			{
				type: data.contract.type,
				target_year: data.contract.target_year,
				date: data.contract.date,
				status: data.contract.status,
				student_progression_when_signed: data.contract.student_progression_when_signed
			},
			null,
			2
		)}</pre>
</section>

<Section id="personnel" title="Personnel">
	<pre class="text-sm p-4 rounded-lg bg-zinc-100">{JSON.stringify(
			data.contract.services,
			null,
			2
		)}</pre>
</Section>

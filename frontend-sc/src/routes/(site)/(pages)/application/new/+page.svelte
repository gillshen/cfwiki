<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';

	export let data;

	const { studentId, contract, programType, year, term, applications } = data;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>Applications</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Create Application</h1>

<div class="text-sm flex gap-2 pt-2 pb-6">
	<div>{data.contract.student_name}</div>
	<div class="text-gray-400">&bullet;</div>
	<div>{data.programType}</div>
	<div class="text-gray-400">&bullet;</div>
	<div>{data.term} {data.year}</div>
</div>

<div class="grid grid-cols-3 gap-4">
	<pre class="text-sm bg-zinc-50 p-2 rounded-md col-span-2">{JSON.stringify(
			{ studentId, contract, programType, year, term },
			null,
			2
		)}</pre>

	<div class="text-sm flex flex-col gap-4">
		{#await applications}
			<LoadingSign />
		{:then applications}
			{#each applications as application}
				<a href={`/application/${application.id}`} target="_self" class="hover:no-underline">
					<StudentApplicationCard {application} />
				</a>
			{/each}
		{/await}
	</div>
</div>

<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';

	export let data;

	const { student, program_iteration, round, program, schools } = data.application;
	const schoolNames = schools.map((s) => s.name).join(' + ');
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>Applications</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{data.application.student.fullname} &bullet; {schoolNames}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2">
	<h1 class="page-title flex gap-2">
		<div>{student.fullname}</div>
		{#if schools.length}
			<div>&bullet;</div>
			<div>{schoolNames}</div>
		{/if}
	</h1>
	<Badge href={`/program/${program.id}`}>{program.type}</Badge>
</section>

<div class="mt-4 text-sm flex flex-col gap-2 bg-zinc-100 p-4 rounded-lg">
	<div class="flex flex-col gap-2">
		{#each schools as school}
			<a href={`/school/${school.id}`}>{school.name}</a>
		{/each}
	</div>
	<a href={`/program/${program.id}`}>{program.display_name}</a>
	<div>{program_iteration.year} {program_iteration.term}</div>
	<div>{round.name} {round.due_date ?? ''} {round.due_time ?? ''}</div>
</div>

<pre class="mt-4 text-sm bg-zinc-100 p-2 rounded-lg">{JSON.stringify(
		data.application,
		null,
		2
	)}</pre>

<pre class="mt-4 text-sm bg-zinc-100 p-2 rounded-lg">{JSON.stringify(data.staffList, null, 2)}</pre>

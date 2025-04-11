<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Card from '$lib/components/ui/card/index';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;

	let canEdit: boolean = true;

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
	<Badge variant="default">{program.type}</Badge>
</section>

<Section id="info">
	<div class="grid grid-cols-2 gap-4">
		<article class="mt-4 text-sm flex flex-col gap-2 bg-zinc-50 p-4 rounded-lg">
			<a href={`/student/${student.id}`}>{student.fullname}</a>
			<div class="flex flex-col gap-2">
				{#each schools as school}
					<a href={`/school/${school.id}`}>{school.name}</a>
				{/each}
			</div>
			<a href={`/program/${program.id}`}>{program.display_name}</a>
			<div>{program_iteration.year} {program_iteration.term}</div>
			<div>{round.name} {round.due_date ?? ''} {round.due_time ?? ''} {round.timezone ?? ''}</div>

			<pre>{JSON.stringify(data.application.services, null, 2)}</pre>
			{#each data.application.staff.sort() as staff}
				<a href={`/cf/${staff}`}>{staff}</a>
			{/each}

			<div class="bg-zinc-100 p-4 rounded-md">
				<div>{data.application.major_1}</div>
				<div>{data.application.major_2}</div>
				<div>{data.application.major_3}</div>
			</div>

			<div>Comments: {data.application.comments}</div>
		</article>
		<article class="mt-4 text-sm flex flex-col gap-2 bg-zinc-50 p-4 rounded-lg">
			<div>Logs</div>
			<pre class="bg-zinc-100 p-4 rounded-md">{JSON.stringify(data.application.logs, null, 2)}</pre>
			<Button variant="outline" class="w-fit">New Status</Button>
		</article>
	</div>
</Section>

<Section
	id="coapplications"
	title={`Other Applicants of ${program_iteration.term} ${program_iteration.year}`}
>
	{#await data.coApplications}
		<LoadingSign />
	{:then coApplications}
		{#if coApplications.length}
			<div class="pb-2">(TODO button)</div>

			<div class="my-4 grid grid-cols-4 gap-4">
				{#each coApplications as coApplication}
					<a href={`/application/${coApplication.id}`} target="_self" class="hover:no-underline">
						<Card.Root class="h-full flex flex-col min-h-[200px]">
							<Card.Header>
								<Card.Title>
									{coApplication.student.fullname}
								</Card.Title>
								<Card.Description class="pt-1">
									<Badge variant="outline" class="w-fit">{coApplication.round_name}</Badge>
								</Card.Description>
							</Card.Header>
							<Card.Content class="pt-2 flex flex-col gap-2 flex-grow">
								<ul class="list-disc ml-3.5 flex flex-col gap-1">
									{#each coApplication.majors as major}
										<li class="text-muted-foreground">{major}</li>
									{/each}
								</ul>
							</Card.Content>
							<Card.Footer>
								<ApplicationStatusSign application={coApplication} />
							</Card.Footer>
						</Card.Root>
					</a>
				{/each}
			</div>
		{/if}
	{/await}
</Section>

{#if canEdit}
	<Section id="delete" hrule>
		<Button variant="destructive" class="mt-4">Delete Application</Button>
	</Section>
{/if}

{#await data.promisedRounds then rounds}
	<!-- for round-change form -->
	<pre class="mt-4 text-sm bg-zinc-100 p-2 rounded-lg h-[200px] overflow-auto">{JSON.stringify(
			rounds,
			null,
			2
		)}</pre>
{/await}

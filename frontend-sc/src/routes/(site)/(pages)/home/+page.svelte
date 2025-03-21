<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Table from '$lib/components/ui/table/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import { defaultBanner } from '$lib/util/userUtils';

	export let data;
</script>

<BreadcrumbContainer home>
	<Breadcrumb.Item>Home</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-4 space-y-2">
	<h1 class="page-title">{data.host.public_banner || defaultBanner(data.host.username)}</h1>
</section>

<div class="grid w-full grid-cols-3">
	<section class="col-span-2 pt-2 mr-8">
		<Tabs.Root>
			<Tabs.List class="grid w-fit grid-cols-2">
				<Tabs.Trigger value="students" class="w-36">Students</Tabs.Trigger>
				<Tabs.Trigger value="applications" class="w-36">Applications</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="students">
				<Card.Root>
					<Card.Header>filters</Card.Header>
					<Card.Content>
						{#await data.students}
							<LoadingSign />
						{:then students}
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head>Student</Table.Head>
										<Table.Head>Contract</Table.Head>
										<Table.Head>Status</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each students as student}
										{#each student.contracts as contract}
											{#if contract.services.map((s) => s.cf_username).includes(data.username)}
												<Table.Row>
													<Table.Cell
														><a href={`/student/${student.id}`}>{student.fullname}</a></Table.Cell
													>
													<Table.Cell>{contract.type} {contract.target_year}</Table.Cell>
													<Table.Cell>{contract.status}</Table.Cell>
												</Table.Row>
											{/if}
										{/each}
									{/each}
								</Table.Body>
							</Table.Root>
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="applications">
				<Card.Root>
					<Card.Header>filters</Card.Header>
					<Card.Content>
						{#await data.applications}
							<LoadingSign />
						{:then applications}
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head>Student</Table.Head>
										<Table.Head>Term</Table.Head>
										<Table.Head>Application</Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each applications as application}
										<Table.Row>
											<Table.Cell>{application.student.fullname}</Table.Cell>
											<Table.Cell>{application.year} {application.term}</Table.Cell>
											<Table.Cell>{application.schools[0].name}</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						{/await}
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<section>
		<h2 class="text-xl font-bold pt-5 pb-2 border-b">Deadlines</h2>
		<div class="text-zinc-300 py-4">Coming soon...</div>
	</section>
</div>

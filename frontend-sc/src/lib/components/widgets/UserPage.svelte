<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Table from '$lib/components/ui/table/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import LinkIcon from '$lib/components/misc/LinkIcon.svelte';

	import type { CfUserDetail } from '$lib/api/user';
	import type { StudentOfCferListItem } from '$lib/api/student';
	import type { ComposedApplication } from '$lib/api/application';
	import { defaultBanner } from '$lib/util/userUtils';

	export let host: CfUserDetail;
	export let students: Promise<StudentOfCferListItem[]>;
	export let applications: Promise<ComposedApplication[]>;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/cf/index">CF People</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{host.username}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-4 space-y-2">
	<h1 class="page-title">{host.public_banner || defaultBanner(host.username)}</h1>
</section>

<div class="w-full grid grid-cols-[minmax(480px,1fr)_240px]">
	<section class="pt-2 mr-12">
		<Tabs.Root>
			<Tabs.List class="grid w-fit grid-cols-2">
				<Tabs.Trigger value="students" class="w-32">Students</Tabs.Trigger>
				<Tabs.Trigger value="applications" class="w-32">Applications</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="students">
				<Card.Root>
					<Card.Header>(TODO filters)</Card.Header>
					<Card.Content>
						{#await students}
							<LoadingSign />
						{:then students}
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head class="font-semibold">Student</Table.Head>
										<Table.Head class="font-semibold">Contract</Table.Head>
										<Table.Head class="font-semibold">Status</Table.Head>
										<Table.Head class="font-semibold"></Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each students as student}
										{#each student.contracts as contract}
											{#if contract.services.map((s) => s.cf_username).includes(host.username)}
												<Table.Row>
													<Table.Cell class="font-medium">{student.fullname}</Table.Cell>
													<Table.Cell class="truncate"
														>{contract.type} {contract.target_year}</Table.Cell
													>
													<Table.Cell>{contract.status}</Table.Cell>
													<Table.Cell>
														<LinkIcon href={`/student/${student.id}`} />
													</Table.Cell>
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
					<Card.Header>(TODO filters)</Card.Header>
					<Card.Content>
						{#await applications}
							<LoadingSign />
						{:then applications}
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.Head class="font-semibold">Student</Table.Head>
										<Table.Head class="font-semibold">Term</Table.Head>
										<Table.Head class="font-semibold">Target</Table.Head>
										<Table.Head class="font-semibold"></Table.Head>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{#each applications as application}
										<Table.Row>
											<Table.Cell>{application.student.fullname}</Table.Cell>
											<Table.Cell>
												<div class="truncate">{application.year} {application.term}</div>
											</Table.Cell>
											<Table.Cell class="max-w-[300px]">
												{#if application.schools.length}
													{#each application.schools as school}
														<div class="truncate">{school.name}</div>
													{/each}
												{:else}
													<div class="truncate">{application.program.display_name}</div>
												{/if}
											</Table.Cell>
											<Table.Cell>
												<LinkIcon href={`/application/${application.id}`} />
											</Table.Cell>
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
		<h2 class="text-lg font-medium pt-5 pb-2 border-b">Important Dates</h2>
		<div class="text-zinc-300 py-2">(TODO)</div>
	</section>
</div>

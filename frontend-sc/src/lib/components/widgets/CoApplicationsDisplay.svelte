<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Table from '$lib/components/ui/table/index';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import LayoutGrid from 'lucide-svelte/icons/layout-grid';
	import List from 'lucide-svelte/icons/list';

	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import LinkIcon from '$lib/components/misc/LinkIcon.svelte';
	import type { ComposedApplication } from '$lib/api/application';
	import { orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';

	export let applications: ComposedApplication[];
	export let showPrograms: boolean = false;
	export let hideYears: boolean = false;
	export let noDataMessage: undefined | string = undefined;
</script>

{#if applications.length}
	<Tabs.Root value="grid-layout">
		<Tabs.List class="flex w-fit">
			<Tabs.Trigger value="grid-layout"><LayoutGrid class="w-4 h-4" /></Tabs.Trigger>
			<Tabs.Trigger value="table-layout"><List class="w-4 h-4" /></Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="grid-layout">
			<div class="my-4 grid grid-cols-4 gap-4">
				{#each applications.sort(orderByStatus).sort(orderByYearDesc) as application}
					<a href={`/application/${application.id}`} target="_self" class="hover:no-underline">
						<Card.Root class="h-full flex flex-col min-h-[200px]">
							<Card.Header>
								<Card.Title>
									{application.student.fullname}
								</Card.Title>
								<Card.Description class="pt-1 flex flex-col gap-2">
									{#if showPrograms}
										<div class="text-muted-foreground font-semibold">
											{application.program.display_name}
										</div>
									{/if}
									{#if hideYears}
										<Badge variant="outline" class="w-fit">{application.round_name}</Badge>
									{:else}
										<Badge variant="outline" class="w-fit"
											>{application.year} {application.round_name}</Badge
										>
									{/if}
								</Card.Description>
							</Card.Header>
							<Card.Content class="pt-2 flex flex-col gap-2 flex-grow">
								<ul class="list-disc ml-3.5 flex flex-col gap-1">
									{#each application.majors as major}
										<li class="text-muted-foreground">{major}</li>
									{/each}
								</ul>
							</Card.Content>
							<Card.Footer>
								<ApplicationStatusSign {application} />
							</Card.Footer>
						</Card.Root>
					</a>
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="table-layout">
			<Table.Root class="w-fit">
				<Table.Header>
					<Table.Row>
						{#if !hideYears}
							<Table.Head class="font-semibold">Year</Table.Head>
						{/if}
						<Table.Head class="font-semibold">Student</Table.Head>
						{#if showPrograms}
							<Table.Head class="font-semibold">Program</Table.Head>
						{/if}
						<Table.Head class="font-semibold">Adm. Plan</Table.Head>
						<Table.Head class="font-semibold">Majors/Tracks</Table.Head>
						<Table.Head class="font-semibold">Status</Table.Head>
						<Table.Head class="font-semibold"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each applications.sort(orderByStatus).sort(orderByYearDesc) as application}
						<Table.Row>
							{#if !hideYears}
								<Table.Cell>{application.year}</Table.Cell>
							{/if}
							<Table.Cell class="font-medium">{application.student.fullname}</Table.Cell>
							{#if showPrograms}
								<Table.Cell>{application.program.display_name}</Table.Cell>
							{/if}
							<Table.Cell>{application.round_name}</Table.Cell>
							<Table.Cell class="max-w-[600px] inline-block truncate text-muted-foreground">
								{#each application.majors as major, index}
									{#if index}
										<span class="text-gray-300 mx-2">&bullet;</span>
									{/if}
									{major}
								{/each}
							</Table.Cell>
							<Table.Cell>
								<ApplicationStatusSign {application} />
							</Table.Cell>
							<Table.Cell>
								<LinkIcon href={`/application/${application.id}`} />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Tabs.Content>
	</Tabs.Root>
{:else}
	<div class="text-sm">{noDataMessage ?? 'No applications.'}</div>
{/if}

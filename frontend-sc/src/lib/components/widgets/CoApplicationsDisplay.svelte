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

	const hasMajor2 = !!applications.filter((a) => a.majors.length > 1).length;
	const hasMajor3 = !!applications.filter((a) => a.majors.length > 2).length;
</script>

{#if applications.length}
	<Tabs.Root value="grid-layout">
		<Tabs.List class="flex w-fit gap-1">
			<Tabs.Trigger value="grid-layout" class="size-7"
				><LayoutGrid class="size-4 shrink-0" /></Tabs.Trigger
			>
			<Tabs.Trigger value="table-layout" class="size-7"
				><List class="size-4 shrink-0" /></Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="grid-layout">
			<div class="my-4 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 gap-6">
				{#each applications.sort(orderByStatus).sort(orderByYearDesc) as application}
					<a href="/application/{application.id}" target="_self" class="hover:no-underline">
						<Card.Root
							class="h-full flex flex-col min-h-[200px] max-w-[320px] hover:shadow-lg hover:scale-[101%] duration-500 ease-out"
						>
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
										<Badge variant="outline" class="w-fit -translate-x-[1px]"
											>{application.round_name}</Badge
										>
									{:else}
										<Badge variant="outline" class="w-fit -translate-x-[1px]"
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
			<Table.Root class="w-full max-w-[1080px]">
				<Table.Header>
					<Table.Row>
						{#if !hideYears}
							<Table.Head class="font-semibold">Year</Table.Head>
						{/if}
						<Table.Head class="font-semibold min-w-[100px]">Student</Table.Head>
						{#if showPrograms}
							<Table.Head class="font-semibold">Program</Table.Head>
						{/if}
						<Table.Head class="font-semibold min-w-[100px]">Adm. Plan</Table.Head>
						{#if hasMajor2}
							<Table.Head class="font-semibold min-w-[130px]">Major/Track 1</Table.Head>
							<Table.Head class="font-semibold min-w-[130px]">Major/Track 2</Table.Head>
							{#if hasMajor3}
								<Table.Head class="font-semibold min-w-[130px]">Major/Track 3</Table.Head>
							{/if}
						{:else}
							<Table.Head class="font-semibold min-w-[130px]">Major/Track</Table.Head>
						{/if}
						<Table.Head class="font-semibold">Status</Table.Head>
						<Table.Head class="font-semibold pr-2"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each applications.sort(orderByStatus).sort(orderByYearDesc) as application}
						<Table.Row>
							{#if !hideYears}
								<Table.Cell>{application.year}</Table.Cell>
							{/if}
							<Table.Cell>
								<a
									href="/student/{application.student.id}"
									class="text-inherit font-semibold truncate">{application.student.fullname}</a
								>
							</Table.Cell>
							{#if showPrograms}
								<Table.Cell>{application.program.display_name}</Table.Cell>
							{/if}
							<Table.Cell>{application.round_name}</Table.Cell>
							<Table.Cell class="truncate max-w-[180px] text-muted-foreground"
								>{application.majors[0] || '-'}</Table.Cell
							>
							{#if hasMajor2}
								<Table.Cell class="truncate max-w-[180px] text-muted-foreground"
									>{application.majors[1] || '-'}</Table.Cell
								>
							{/if}
							{#if hasMajor3}
								<Table.Cell class="truncate max-w-[180px] text-muted-foreground"
									>{application.majors[2] || '-'}</Table.Cell
								>
							{/if}
							<Table.Cell class="flex">
								<div class="min-w-0">
									<ApplicationStatusSign {application} />
								</div>
							</Table.Cell>
							<Table.Cell class="max-w-[16px] pr-2">
								<div class="flex justify-end">
									<LinkIcon href="/application/{application.id}" />
								</div>
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

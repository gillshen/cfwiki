<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import { cn } from '$lib/utils';

	import type { ComposedApplication } from '$lib/api/application';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import LinkIcon from '$lib/components/misc/LinkIcon.svelte';
	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';

	export let applications: ComposedApplication[];

	const hasMajor2 = !!applications.filter((a) => a.majors.length > 1).length;
	const hasMajor3 = !!applications.filter((a) => a.majors.length > 2).length;
</script>

<Table.Root class="w-full max-w-[1064px] flex-grow-0">
	<Table.Header>
		<Table.Row>
			<Table.Head class="font-semibold pl-2 w-7"></Table.Head>
			<Table.Head class="font-semibold">School</Table.Head>
			<Table.Head class="font-semibold">Program</Table.Head>
			<Table.Head class="font-semibold min-w-[100px]">Year & Plan</Table.Head>
			{#if hasMajor2}
				<Table.Head class="font-semibold min-w-[128px]">Major/Track 1</Table.Head>
				<Table.Head class="font-semibold min-w-[128px]">Major/Track 2</Table.Head>
				{#if hasMajor3}
					<Table.Head class="font-semibold min-w-[128px]">Major/Track 3</Table.Head>
				{/if}
			{:else}
				<Table.Head class="font-semibold min-w-[128px]">Major/Track</Table.Head>
			{/if}
			<Table.Head class="font-semibold">Status</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each applications
			.sort(orderBySchoolName)
			.sort(orderByStatus)
			.sort(orderByYearDesc) as application}
			<Table.Row>
				<Table.Cell class="max-w-[16px] pl-2">
					<div class="flex justify-start">
						<LinkIcon href="/application/{application.id}" />
					</div>
				</Table.Cell>
				<Table.Cell>
					<div
						class={cn(
							'flex flex-col',
							hasMajor3 ? 'max-w-[240px]' : hasMajor2 ? 'max-w-[270px]' : 'max-w-[300px]'
						)}
					>
						{#each application.schools as school}
							<a href="/school/{school.id}" class="text-inherit font-semibold truncate"
								>{school.name}</a
							>
						{/each}
					</div>
				</Table.Cell>
				<Table.Cell class="max-w-[270px] truncate">{application.program.display_name}</Table.Cell>
				<Table.Cell class="truncate">{application.year} {application.round_name}</Table.Cell>
				<Table.Cell
					class={cn(
						'truncate text-muted-foreground',
						hasMajor3 ? 'max-w-[128px]' : hasMajor2 ? 'max-w-[180px]' : ''
					)}>{application.majors[0] || '-'}</Table.Cell
				>
				{#if hasMajor2}
					<Table.Cell class="truncate max-w-[128px] text-muted-foreground"
						>{application.majors[1] || '-'}</Table.Cell
					>
				{/if}
				{#if hasMajor3}
					<Table.Cell class="truncate max-w-[128px] text-muted-foreground"
						>{application.majors[2] || '-'}</Table.Cell
					>
				{/if}
				<Table.Cell class="flex max-w-[120px]">
					<div class="min-w-0">
						<ApplicationStatusSign {application} />
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

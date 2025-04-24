<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import type { ComposedApplication } from '$lib/api/application';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import LinkIcon from '$lib/components/misc/LinkIcon.svelte';
	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';
	import { cn } from '$lib/utils';

	export let applications: ComposedApplication[];

	const hasMajor2 = !!applications.filter((a) => a.majors.length > 1).length;
	const hasMajor3 = !!applications.filter((a) => a.majors.length > 2).length;
</script>

<Table.Root class="w-full max-w-[1080px]">
	<Table.Header>
		<Table.Row>
			<Table.Head class="font-semibold">School</Table.Head>
			<Table.Head class="font-semibold">Program</Table.Head>
			<Table.Head class="font-semibold">Year</Table.Head>
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
			<Table.Head class="font-semibold"></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each applications
			.sort(orderBySchoolName)
			.sort(orderByStatus)
			.sort(orderByYearDesc) as application}
			<Table.Row>
				<Table.Cell
					class={cn(
						'inline-flex flex-col',
						hasMajor3 ? 'max-w-[220px]' : hasMajor2 ? 'max-w-[250px]' : 'max-w-[280px]'
					)}
				>
					{#each application.schools as school}
						<a href={`/school/${school.id}`} class="text-inherit font-semibold truncate"
							>{school.name}</a
						>
					{/each}
				</Table.Cell>
				<Table.Cell class="truncate">{application.program.display_name}</Table.Cell>
				<Table.Cell>{application.year}</Table.Cell>
				<Table.Cell>{application.round_name}</Table.Cell>
				<Table.Cell class="truncate max-w-[160px] text-muted-foreground"
					>{application.majors[0] || '-'}</Table.Cell
				>
				{#if hasMajor2}
					<Table.Cell class="truncate max-w-[130px] text-muted-foreground"
						>{application.majors[1] || '-'}</Table.Cell
					>
				{/if}
				{#if hasMajor3}
					<Table.Cell class="truncate max-w-[130px] text-muted-foreground"
						>{application.majors[2] || '-'}</Table.Cell
					>
				{/if}
				<Table.Cell>
					<ApplicationStatusSign {application} />
				</Table.Cell>
				<Table.Cell class="max-w-[16px]">
					<div class="flex justify-end">
						<LinkIcon href={`/application/${application.id}`} />
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

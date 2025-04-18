<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import LinkIcon from '$lib/components/misc/LinkIcon.svelte';
	import type { ComposedApplication } from '$lib/api/application';
	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';

	export let applications: ComposedApplication[];
</script>

<Table.Root class="w-full">
	<Table.Header>
		<Table.Row>
			<Table.Head class="font-semibold">School</Table.Head>
			<Table.Head class="font-semibold">Program</Table.Head>
			<Table.Head class="font-semibold">Year</Table.Head>
			<Table.Head class="font-semibold min-w-[100px]">Adm. Plan</Table.Head>
			<Table.Head class="font-semibold min-w-[130px]">Majors/Tracks</Table.Head>
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
				<Table.Cell>
					{#each application.schools as school}
						<a href={`/school/${school.id}`} class="text-inherit font-semibold truncate"
							>{school.name}</a
						>
					{/each}
				</Table.Cell>
				<Table.Cell class="truncate">{application.program.display_name}</Table.Cell>
				<Table.Cell>{application.year}</Table.Cell>
				<Table.Cell>{application.round_name}</Table.Cell>
				<Table.Cell>
					<div class="inline-block align-middle truncate text-muted-foreground">
						{#each application.majors as major, index}
							{#if index}<span class="text-gray-300 mx-2">&bullet;</span>{/if}{major}
						{/each}
					</div>
				</Table.Cell>
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

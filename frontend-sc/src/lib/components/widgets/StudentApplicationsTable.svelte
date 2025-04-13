<script lang="ts">
	import * as Table from '$lib/components/ui/table/index';
	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import type { ComposedApplication } from '$lib/api/application';
	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';

	export let applications: ComposedApplication[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="font-bold">School</Table.Head>
			<Table.Head class="font-bold">Program</Table.Head>
			<Table.Head class="font-bold">Year</Table.Head>
			<Table.Head class="font-bold">Adm. Plan</Table.Head>
			<Table.Head class="font-bold">Majors/Track</Table.Head>
			<Table.Head class="font-bold">Status</Table.Head>
			<Table.Head class="font-bold"></Table.Head>
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
						<div class="font-semibold">{school.name}</div>
					{/each}
				</Table.Cell>
				<Table.Cell>{application.program.display_name}</Table.Cell>
				<Table.Cell>{application.year}</Table.Cell>
				<Table.Cell>{application.round_name}</Table.Cell>
				<Table.Cell>
					<ul class="list-disc ml-3.5 flex flex-col gap-1 text-muted-foreground">
						{#each application.majors as major}
							<li>{major}</li>
						{/each}
					</ul>
				</Table.Cell>
				<Table.Cell>
					<ApplicationStatusSign {application} />
				</Table.Cell>
				<Table.Cell>
					<a href={`/application/${application.id}`}><SquareArrowOutUpRight class="w-4 h-4" /></a>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

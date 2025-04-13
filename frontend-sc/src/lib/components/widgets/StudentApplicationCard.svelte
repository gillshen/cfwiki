<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import type { ComposedApplication } from '$lib/api/application';

	export let application: ComposedApplication;
</script>

<Card.Root class="h-full flex flex-col">
	<Card.Header>
		<Card.Title>
			{#each application.schools as school}
				<div>{school.name}</div>
			{/each}
		</Card.Title>
		<Card.Description class="pt-1 flex gap-2 flex-wrap">
			<div class="text-muted-foreground font-semibold">{application.program.display_name}</div>
			<Badge variant="outline" class="w-fit">{application.year} {application.round_name}</Badge>
		</Card.Description>
	</Card.Header>
	<Card.Content class="pt-2 flex flex-col gap-2 flex-grow">
		<ul class="list-disc ml-3.5 flex flex-col gap-1 text-muted-foreground">
			{#each application.majors as major}
				<li>{major}</li>
			{/each}
		</ul>
	</Card.Content>
	<Card.Footer>
		<ApplicationStatusSign {application} />
	</Card.Footer>
</Card.Root>

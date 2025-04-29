<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import ApplicationStatusSign from '$lib/components/misc/ApplicationStatusSign.svelte';
	import type { ComposedApplication } from '$lib/api/application';

	export let application: ComposedApplication;
	export let compact: boolean = false;
	export let hideYear: boolean = false;
	export let className: string = '';
	export { className as class };
</script>

<Card.Root class={cn('h-full flex flex-col', className)}>
	<Card.Header>
		<Card.Title>
			{#each application.schools as school}
				<div>{school.name}</div>
			{/each}
		</Card.Title>
		<Card.Description class="flex flex-col gap-2">
			<div class="text-muted-foreground">{application.program.display_name}</div>
			{#if hideYear}
				<Badge variant="outline" class="w-fit -translate-x-[1px]">{application.round_name}</Badge>
			{:else}
				<Badge variant="outline" class="w-fit -translate-x-[1px]"
					>{application.year} {application.round_name}</Badge
				>
			{/if}
		</Card.Description>
	</Card.Header>
	{#if compact}
		<Card.Content class="pt-4 flex flex-col gap-2 flex-grow">
			<ApplicationStatusSign {application} />
		</Card.Content>
	{:else}
		<Card.Content class="pt-4 flex flex-col gap-2 flex-grow">
			<ul class="list-disc ml-3.5 flex flex-col gap-1 text-muted-foreground">
				{#each application.majors as major}
					<li>{major}</li>
				{/each}
			</ul>
		</Card.Content>
		<Card.Footer>
			<ApplicationStatusSign {application} />
		</Card.Footer>
	{/if}
</Card.Root>

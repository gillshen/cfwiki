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

	const badgeText = hideYear
		? application.round_name
		: `${application.year} ${application.round_name}`;
</script>

<Card.Root class={cn('h-full flex flex-col', className)}>
	<Card.Header class={compact ? 'pt-3' : ''}>
		<Card.Title>
			{#each application.schools as school}
				<p class={cn('text-pretty leading-5', compact ? '' : 'text-base')}>
					{school.name}
				</p>
			{/each}
		</Card.Title>
		<Card.Description
			class={compact ? 'inline-flex flex-wrap items-center gap-2' : 'flex flex-col gap-2 pt-2'}
		>
			<p class="text-muted-foreground text-pretty">{application.program.display_name}</p>
			<Badge variant="outline" class="w-fit h-5 bg-muted text-muted-foreground -translate-x-[1px]"
				>{badgeText}</Badge
			>
			{#if compact}
				<ApplicationStatusSign {application} iconOnly class="h-5" />
			{/if}
		</Card.Description>
	</Card.Header>
	{#if compact}
		<Card.Footer class="pb-4" />
	{:else}
		<Card.Content class="pt-4 flex flex-col gap-2 flex-grow min-w-[240px]">
			<ul class="list-disc ml-3.5 flex flex-col gap-1 text-muted-foreground">
				{#each application.majors as major}
					<li class="text-pretty">{major}</li>
				{/each}
			</ul>
		</Card.Content>
		<Card.Footer>
			<ApplicationStatusSign {application} />
		</Card.Footer>
	{/if}
</Card.Root>

<script lang="ts">
	import { Accordion, AccordionItem, Badge } from 'flowbite-svelte';
	import type { ComposedApplicationListItem } from '$lib/api/application';

	export let groupedApplications: Record<string | number, ComposedApplicationListItem[]>;
	export let divClass: string = '';
	export let openFirst: boolean = true;
</script>

<Accordion flush multiple class={divClass}>
	{#each Object.entries(groupedApplications) as [heading, subsetOfApplications], index}
		<AccordionItem
			class="mt-0 mb-0 pb-0 border-none hover:text-primary-700"
			borderSharedClass="border-none"
			open={openFirst && !index}
		>
			<div slot="header" class="flex items-center gap-2">
				<span class="tabular-nums">{heading}</span>
				<Badge size="sm">{subsetOfApplications.length}</Badge>
			</div>

			<slot {subsetOfApplications} />
		</AccordionItem>
	{/each}
</Accordion>

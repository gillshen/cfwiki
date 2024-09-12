<script lang="ts">
	import { Heading, Badge } from 'flowbite-svelte';

	import type { ComposedApplication } from '$lib/api/application';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import FetchingDataErrorSign from '$lib/components/misc/FetchingDataErrorSign.svelte';

	export let applications: Promise<ComposedApplication[]>;
	export let heading: string = 'Applications';
	export let noDataText: string = 'None';
	export let errorText: string = '';
	export let showHeading: boolean = true;
</script>

{#if showHeading}
	<Heading tag="h2" class="section-title flex-title">
		{heading}
		{#await applications then applications}
			{#if applications.length}
				<div class="relative -top-2 -left-1">
					<Badge class="h-5">{applications.length}</Badge>
				</div>
			{/if}
		{/await}
	</Heading>
{/if}

{#await applications}
	<FetchingDataSign divClass="mt-6" />
{:then applications}
	{#if !applications.length}
		<NoDataSign text={noDataText} divClass="mt-6" />
	{:else}
		<slot {applications} />
	{/if}
{:catch}
	<FetchingDataErrorSign text={errorText} divClass="mt-6" />
{/await}

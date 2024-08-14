<script lang="ts">
	import { Heading, Badge } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import FetchingDataErrorSign from '$lib/components/misc/FetchingDataErrorSign.svelte';

	export let applications: Promise<ApplicationListItem[]>;
	export let heading: string = 'Applications';
	export let noDataText: string = 'No applications';
	export let errorText: string = '';
</script>

<Heading tag="h2" class="text-2xl font-bold flex items-center gap-2">
	{heading}
	{#await applications then applications}
		{#if applications.length}
			<Badge>{applications.length}</Badge>
		{/if}
	{/await}
</Heading>

{#await applications}
	<FetchingDataSign divClass="mt-8" />
{:then applications}
	{#if !applications.length}
		<NoDataSign text={noDataText} divClass="mt-6" />
	{:else}
		<slot {applications} />
	{/if}
{:catch}
	<FetchingDataErrorSign text={errorText} divClass="mt-6" />
{/await}

<script lang="ts">
	import { Badge, Heading } from 'flowbite-svelte';

	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import FetchingDataErrorSign from '$lib/components/misc/FetchingDataErrorSign.svelte';
	import type { EnrollmentListItem } from '$lib/api/enrollment';

	export let enrollments: Promise<EnrollmentListItem[]>;
	export let heading: string = 'Students and Alumni';
	export let noDataText: string = 'None';
	export let errorText: string = '';
</script>

<Heading tag="h2" class="section-title flex-title">
	{heading}
	{#await enrollments then enrollments}
		{#if enrollments.length}
			<Badge color="dark">{enrollments.length}</Badge>
		{/if}
	{/await}
</Heading>

{#await enrollments}
	<FetchingDataSign divClass="mt-8" />
{:then enrollments}
	{#if !enrollments.length}
		<NoDataSign text={noDataText} divClass="mt-6" />
	{:else}
		<slot {enrollments} />
	{/if}
{:catch}
	<FetchingDataErrorSign text={errorText} divClass="mt-6" />
{/await}

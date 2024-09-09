<script lang="ts">
	import ApplicationStatsPage from '$lib/components/stats-page/ApplicationStatsPage.svelte';
	import InvalidStatsPage from '$lib/components/stats-page/InvalidStatsPage.svelte';

	export let data;

	const backUrl = `/school/${data.school.id}`;
	const backUrlText = 'Back to the School Page';
</script>

{#if data.school.type === 'Secondary School'}
	<ApplicationStatsPage
		applications={data.applications}
		applicants={data.applicants}
		title={`${data.school.alt_name || data.school.name} | Graduate Programs`}
		{backUrl}
		{backUrlText}
	/>
{:else}
	<InvalidStatsPage {backUrl} {backUrlText} />
{/if}

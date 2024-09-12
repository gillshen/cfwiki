<script lang="ts">
	import ApplicationStatsPage from '$lib/components/stats-page/ApplicationStatsPage.svelte';
	import InvalidStatsPage from '$lib/components/stats-page/InvalidStatsPage.svelte';
	import { isGraduate } from '$lib/utils/applicationUtils';

	export let data;

	const backUrl = `/school/${data.school.id}`;
	const backUrlText = `Back to ${data.school.name}`;
</script>

{#if data.school.type === 'University'}
	<ApplicationStatsPage
		applications={data.applications.then((appls) => appls.filter(isGraduate))}
		title={`${data.school.alt_name || data.school.name} | Graduate Programs`}
		{backUrl}
		{backUrlText}
	/>
{:else}
	<InvalidStatsPage {backUrl} {backUrlText} />
{/if}

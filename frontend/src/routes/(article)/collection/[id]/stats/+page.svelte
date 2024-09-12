<script lang="ts">
	import ApplicationStatsPage from '$lib/components/stats-page/ApplicationStatsPage.svelte';

	export let data;
</script>

<ApplicationStatsPage
	applications={data.applications}
	title={data.collection.name}
	backUrl={`/collection/${data.collection.id}`}
	backUrlText="Back to the Collection Page"
/>

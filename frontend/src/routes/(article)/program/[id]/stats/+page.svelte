<script lang="ts">
	import ApplicationStatsPage from '$lib/components/stats-page/ApplicationStatsPage.svelte';
	import { formatSchoolNamesShort } from '$lib/utils/programUtils';

	export let data;
</script>

<ApplicationStatsPage
	applications={data.applications}
	title={`${formatSchoolNamesShort(data.program)} | ${data.program.display_name}`}
	backUrl={`/program/${data.program.id}`}
	backUrlText="Back to the Program Page"
/>

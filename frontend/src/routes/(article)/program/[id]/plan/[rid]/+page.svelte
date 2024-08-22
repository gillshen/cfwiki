<script lang="ts">
	import ApplicationRoundPage from '$lib/components/application-round-page/ApplicationRoundPage.svelte';

	export let data;
</script>

<ApplicationRoundPage
	program={data.program}
	roundForm={data.roundForm}
	year={data.year}
	term={data.term}
	action={`/program/${data.program.id}/plan/${data.roundId}?/updateApplicationRound`}
/>

<script lang="ts">
	import {
		type ActScore,
		actOverall,
		actSubToPercentage,
		actWritingToPercentage
	} from '$lib/api/scores';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: ActScore;
	export let onClick: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="ACT"
		score={actOverall(score) ?? 'N/A'}
		date={score.date}
		{onClick}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar label="Math" percentage={actSubToPercentage(score.math)} value={score.math} />

		<ScoreBar
			label="Science"
			percentage={actSubToPercentage(score.science)}
			value={score.science}
		/>

		<ScoreBar
			label="English"
			percentage={actSubToPercentage(score.english)}
			value={score.english}
		/>

		<ScoreBar
			label="Reading"
			percentage={actSubToPercentage(score.reading)}
			value={score.reading}
		/>

		{#if score.writing !== null}
			<ScoreBar
				label="Writing"
				percentage={actWritingToPercentage(score.writing)}
				value={score.writing}
			/>
		{/if}
	</svelte:fragment>
</ScoreContainer>

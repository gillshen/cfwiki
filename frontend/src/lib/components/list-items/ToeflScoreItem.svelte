<script lang="ts">
	import { type ToeflScore, toeflOverall, toeflSubToPercentage } from '$lib/api/scores';
	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: ToeflScore;
	export let onClick: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="TOEFL"
		score={toeflOverall(score) ?? 'N/A'}
		date={score.date}
		{onClick}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar
			label="Reading"
			percentage={toeflSubToPercentage(score.reading)}
			value={score.reading}
		/>

		<ScoreBar
			label="Listening"
			percentage={toeflSubToPercentage(score.listening)}
			value={score.listening}
		/>

		<ScoreBar
			label="Speaking"
			percentage={toeflSubToPercentage(score.speaking)}
			value={score.speaking}
		/>

		<ScoreBar
			label="Writing"
			percentage={toeflSubToPercentage(score.writing)}
			value={score.writing}
		/>
	</svelte:fragment>
</ScoreContainer>

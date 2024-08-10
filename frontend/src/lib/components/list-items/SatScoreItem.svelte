<script lang="ts">
	import {
		type SatScore,
		satOverall,
		satSubToPercentage,
		satEssayToPercentage
	} from '$lib/api/scores';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: SatScore;
	export let onClick: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="SAT"
		score={satOverall(score) ?? 'N/A'}
		date={score.date}
		{onClick}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar
			label="Reading and writing"
			percentage={satSubToPercentage(score.ebrw)}
			value={score.ebrw}
		/>

		<ScoreBar label="Math" percentage={satSubToPercentage(score.math)} value={score.math} />

		{#if score.essay !== null}
			<ScoreBar label="Essay" percentage={satEssayToPercentage(score.essay)} value={score.essay} />
		{/if}
	</svelte:fragment>
</ScoreContainer>

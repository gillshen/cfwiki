<script lang="ts">
	import {
		type GreScore,
		greOverall,
		greSubToPercentage,
		greWritingToPercentage
	} from '$lib/api/scores';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: GreScore;
	export let onClick: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="SAT"
		score={greOverall(score) ?? 'N/A'}
		date={score.date}
		{onClick}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar label="Verbal" percentage={greSubToPercentage(score.verbal)} value={score.verbal} />

		<ScoreBar
			label="Quantitative"
			percentage={greSubToPercentage(score.quant)}
			value={score.quant}
		/>

		{#if score.writing !== null}
			<ScoreBar
				label="Writing"
				percentage={greWritingToPercentage(score.writing)}
				value={score.writing}
			/>
		{/if}
	</svelte:fragment>
</ScoreContainer>

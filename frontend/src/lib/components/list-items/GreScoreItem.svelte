<script lang="ts">
	import { type GreScore } from '$lib/api/scores';
	import { greOverall, greSubToPercentage, greWritingToPercentage } from '$lib/utils/scoresUtils';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: GreScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="GRE"
		score={greOverall(score)}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
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

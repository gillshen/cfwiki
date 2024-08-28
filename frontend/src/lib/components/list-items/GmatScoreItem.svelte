<script lang="ts">
	import { type GmatScore } from '$lib/api/scores';
	import {
		gmatSubToPercentage,
		gmatReasoningToPercentage,
		gmatWritingToPercentage,
		gmatLegacySubToPercentage
	} from '$lib/utils/scoresUtils';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: GmatScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};

	$: toPercentag = score.is_legacy ? gmatLegacySubToPercentage : gmatSubToPercentage;
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="GMAT"
		score={score.total}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar label="Verbal" percentage={toPercentag(score.verbal)} value={score.verbal} />

		<ScoreBar label="Quantitative" percentage={toPercentag(score.quant)} value={score.quant} />

		{#if !score.is_legacy && score.data_insights !== null}
			<ScoreBar
				label="Data Insights"
				percentage={gmatSubToPercentage(score.data_insights)}
				value={score.data_insights}
			/>
		{/if}

		{#if score.is_legacy && score.reasoning !== null}
			<ScoreBar
				label="Integrated Reasoning"
				percentage={gmatReasoningToPercentage(score.reasoning)}
				value={score.reasoning}
			/>
		{/if}

		{#if score.is_legacy && score.writing !== null}
			<ScoreBar
				label="Writing"
				percentage={gmatWritingToPercentage(score.writing)}
				value={score.writing}
			/>
		{/if}
	</svelte:fragment>
</ScoreContainer>

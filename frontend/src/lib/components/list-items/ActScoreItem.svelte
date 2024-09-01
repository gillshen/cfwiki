<script lang="ts">
	import { type ActScore } from '$lib/api/scores';
	import { actOverall, actToPercentage, actWritingToPercentage } from '$lib/utils/scoresUtils';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: ActScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="ACT"
		score={actOverall(score)}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar label="Math" percentage={actToPercentage(score.math)} value={score.math} />
		<ScoreBar label="Science" percentage={actToPercentage(score.science)} value={score.science} />
		<ScoreBar label="English" percentage={actToPercentage(score.english)} value={score.english} />
		<ScoreBar label="Reading" percentage={actToPercentage(score.reading)} value={score.reading} />

		{#if score.writing !== null}
			<ScoreBar
				label="Writing"
				percentage={actWritingToPercentage(score.writing)}
				value={score.writing}
			/>
		{/if}
	</svelte:fragment>
</ScoreContainer>

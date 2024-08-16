<script lang="ts">
	import { type SatScore } from '$lib/api/scores';
	import { satOverall, satSubToPercentage, satEssayToPercentage } from '$lib/utils/scoresUtils';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: SatScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="SAT"
		score={satOverall(score)}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
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

<script lang="ts">
	import { type ToeflScore } from '$lib/api/scores';
	import { toeflOverall, toeflSubToPercentage } from '$lib/utils/scoresUtils';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: ToeflScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="TOEFL"
		score={toeflOverall(score)}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
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

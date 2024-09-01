<script lang="ts">
	import { type IeltsScore } from '$lib/api/scores';
	import { ieltsOverall, ieltsToPercentage } from '$lib/utils/scoresUtils';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: IeltsScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};

	$: overall = ieltsOverall(score);
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="IELTS"
		score={overall !== null ? overall.toFixed(1) : null}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar label="Reading" percentage={ieltsToPercentage(score.reading)} value={score.reading} />

		<ScoreBar
			label="Listening"
			percentage={ieltsToPercentage(score.listening)}
			value={score.listening}
		/>

		<ScoreBar
			label="Speaking"
			percentage={ieltsToPercentage(score.speaking)}
			value={score.speaking}
		/>

		<ScoreBar label="Writing" percentage={ieltsToPercentage(score.writing)} value={score.writing} />
	</svelte:fragment>
</ScoreContainer>

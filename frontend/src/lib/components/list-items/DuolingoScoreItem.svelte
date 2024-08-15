<script lang="ts">
	import { type DuolingoScore, duolingoToPercentage } from '$lib/api/scores';
	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: DuolingoScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="Duolingo"
		score={score.overall}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar
			label="Literacy"
			percentage={duolingoToPercentage(score.literacy)}
			value={score.literacy}
		/>

		<ScoreBar
			label="Comprehension"
			percentage={duolingoToPercentage(score.comprehension)}
			value={score.comprehension}
		/>

		<ScoreBar
			label="Conversation"
			percentage={duolingoToPercentage(score.conversation)}
			value={score.conversation}
		/>

		<ScoreBar
			label="Production"
			percentage={duolingoToPercentage(score.production)}
			value={score.production}
		/>
	</svelte:fragment>
</ScoreContainer>

<script lang="ts">
	import { type LsatScore } from '$lib/api/scores';
	import { lsatToPercentage } from '$lib/utils/scoresUtils';

	import ScoreContainer from '$lib/components/containers/ScoreContainer.svelte';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';
	import ScoreBar from '$lib/components/list-items/ScoreBar.svelte';

	export let score: LsatScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<ScoreContainer>
	<ScoreItem
		size="lg"
		subject="LSAT"
		score={score.score}
		date={score.date}
		{canEdit}
		{updateAction}
		{deleteAction}
		slot="header"
	/>

	<svelte:fragment slot="body">
		<ScoreBar label="" percentage={lsatToPercentage(score.score)} value={score.score} />
	</svelte:fragment>
</ScoreContainer>

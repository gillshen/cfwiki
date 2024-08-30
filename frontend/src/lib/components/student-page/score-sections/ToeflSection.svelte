<script lang="ts">
	import type { ToeflScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import ToeflScoreItem from '$lib/components/list-items/ToeflScoreItem.svelte';
	import { bestToefl, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: ToeflScore) => () => void;
	export let onDelete: (score: ToeflScore) => () => void;

	$: scores = student.toefl;
	$: bestScore = bestToefl(scores);
</script>

<TabbedScores {scores} heading="TOEFL">
	<ToeflScoreItem
		slot="first"
		score={bestScore}
		{canEdit}
		updateAction={onUpdate(bestScore)}
		deleteAction={onDelete(bestScore)}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<ToeflScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

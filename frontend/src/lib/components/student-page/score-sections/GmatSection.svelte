<script lang="ts">
	import type { GmatScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import GmatScoreItem from '$lib/components/list-items/GmatScoreItem.svelte';
	import { bestGmat, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: GmatScore) => () => void;
	export let onDelete: (score: GmatScore) => () => void;

	$: scores = student.gmat;
	$: bestScore = bestGmat(scores);
</script>

<TabbedScores {scores} heading="GMAT">
	<GmatScoreItem
		slot="first"
		score={bestScore}
		{canEdit}
		updateAction={onUpdate(bestScore)}
		deleteAction={onDelete(bestScore)}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<GmatScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

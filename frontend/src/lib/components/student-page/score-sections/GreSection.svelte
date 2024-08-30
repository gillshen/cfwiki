<script lang="ts">
	import type { GreScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import GreScoreItem from '$lib/components/list-items/GreScoreItem.svelte';
	import { bestGre, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: GreScore) => () => void;
	export let onDelete: (score: GreScore) => () => void;

	$: scores = student.gre;
	$: bestScore = bestGre(scores);
</script>

<TabbedScores {scores} heading="GRE">
	<GreScoreItem
		slot="first"
		score={bestScore}
		{canEdit}
		updateAction={onUpdate(bestScore)}
		deleteAction={onDelete(bestScore)}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<GreScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

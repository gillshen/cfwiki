<script lang="ts">
	import type { DuolingoScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import DuolingoScoreItem from '$lib/components/list-items/DuolingoScoreItem.svelte';
	import { bestDuolingo, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: DuolingoScore) => () => void;
	export let onDelete: (score: DuolingoScore) => () => void;

	$: scores = student.duolingo;
	$: bestScore = bestDuolingo(scores);
</script>

<TabbedScores {scores} heading="Duolingo">
	<DuolingoScoreItem
		slot="first"
		score={bestScore}
		{canEdit}
		updateAction={onUpdate(bestScore)}
		deleteAction={onDelete(bestScore)}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<DuolingoScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

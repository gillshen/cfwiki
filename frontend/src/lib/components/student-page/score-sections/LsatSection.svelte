<script lang="ts">
	import type { LsatScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import LsatScoreItem from '$lib/components/list-items/LsatScoreItem.svelte';
	import { bestLsat, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: LsatScore) => () => void;
	export let onDelete: (score: LsatScore) => () => void;

	$: scores = student.lsat;
	$: bestScore = bestLsat(scores);
</script>

<TabbedScores {scores} heading="LSAT">
	<LsatScoreItem
		slot="first"
		score={bestScore}
		{canEdit}
		updateAction={onUpdate(bestScore)}
		deleteAction={onDelete(bestScore)}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<LsatScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

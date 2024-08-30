<script lang="ts">
	import type { SatScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import SatScoreItem from '$lib/components/list-items/SatScoreItem.svelte';
	import { superSat, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: SatScore) => () => void;
	export let onDelete: (score: SatScore) => () => void;

	$: scores = student.sat;
	$: superScore = superSat(scores);
</script>

<TabbedScores {scores} heading="SAT" firstTitle="Superscore">
	<SatScoreItem
		slot="first"
		score={superScore}
		canEdit={canEdit && scores.length === 1}
		updateAction={scores.length === 1 ? onUpdate(superScore) : () => {}}
		deleteAction={scores.length === 1 ? onDelete(superScore) : () => {}}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<SatScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

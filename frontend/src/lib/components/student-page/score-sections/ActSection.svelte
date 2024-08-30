<script lang="ts">
	import type { ActScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import ActScoreItem from '$lib/components/list-items/ActScoreItem.svelte';
	import { superAct, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: ActScore) => () => void;
	export let onDelete: (score: ActScore) => () => void;

	$: scores = student.act;
	$: superScore = superAct(scores);
</script>

<TabbedScores {scores} heading="ACT" firstTitle="Superscore">
	<ActScoreItem
		slot="first"
		score={superScore}
		canEdit={canEdit && scores.length === 1}
		updateAction={scores.length === 1 ? onUpdate(superScore) : () => {}}
		deleteAction={scores.length === 1 ? onDelete(superScore) : () => {}}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<ActScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

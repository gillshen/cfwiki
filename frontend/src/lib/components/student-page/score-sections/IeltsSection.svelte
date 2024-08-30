<script lang="ts">
	import type { IeltsScore } from '$lib/api/scores';
	import type { StudentDetail } from '$lib/api/student';
	import TabbedScores from '$lib/components/student-page/TabbedScores.svelte';
	import IeltsScoreItem from '$lib/components/list-items/IeltsScoreItem.svelte';
	import { bestIelts, orderByDateDesc } from '$lib/utils/scoresUtils';

	export let student: StudentDetail;
	export let canEdit: boolean;
	export let onUpdate: (score?: IeltsScore) => () => void;
	export let onDelete: (score: IeltsScore) => () => void;

	$: scores = student.ielts;
	$: bestScore = bestIelts(scores);
</script>

<TabbedScores {scores} heading="IELTS">
	<IeltsScoreItem
		slot="first"
		score={bestScore}
		{canEdit}
		updateAction={onUpdate(bestScore)}
		deleteAction={onDelete(bestScore)}
	/>

	<svelte:fragment slot="all">
		{#each scores.sort(orderByDateDesc) as score}
			<IeltsScoreItem
				{score}
				{canEdit}
				updateAction={onUpdate(score)}
				deleteAction={onDelete(score)}
			/>
		{/each}
	</svelte:fragment>
</TabbedScores>

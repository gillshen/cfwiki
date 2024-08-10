<script lang="ts">
	import type { AlevelGrade, IbGrade } from '$lib/api/scores';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';

	export let grade: IbGrade | AlevelGrade;
	export let onClick: () => any = () => {};
</script>

<ScoreItem subject={grade.subject} score={grade.grade} date={grade.date} {onClick}>
	<svelte:fragment slot="note">
		<span>|</span><span>{grade.type === 'predicted' ? 'Predicted' : 'Final'}</span>
	</svelte:fragment>
</ScoreItem>

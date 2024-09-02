<script lang="ts">
	import type { AlevelGrade, IbGrade } from '$lib/api/scores';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';

	export let grade: IbGrade | AlevelGrade;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};

	$: isFinal = grade.type === 'final';
</script>

<ScoreItem
	subject={grade.subject}
	score={grade.grade}
	date={grade.date}
	{canEdit}
	{updateAction}
	{deleteAction}
>
	<svelte:fragment slot="note">
		<span>|</span><span class={isFinal ? '' : 'text-primary-500'}
			>{isFinal ? 'Final' : 'Predicted'}</span
		>
	</svelte:fragment>
</ScoreItem>

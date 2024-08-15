<script lang="ts">
	import type { ApScore } from '$lib/api/scores';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';

	export let score: ApScore;
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<ScoreItem
	subject={score.subject}
	score={score.score}
	date={score.date}
	{canEdit}
	{updateAction}
	{deleteAction}
/>

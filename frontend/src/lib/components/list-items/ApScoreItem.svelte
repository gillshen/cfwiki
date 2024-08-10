<script lang="ts">
	import type { ApScore } from '$lib/api/scores';
	import ScoreItem from '$lib/components/list-items/ScoreItem.svelte';

	export let score: ApScore;
	export let onClick: () => any = () => {};
</script>

<ScoreItem subject={score.subject} score={score.score} date={score.date} {onClick} />

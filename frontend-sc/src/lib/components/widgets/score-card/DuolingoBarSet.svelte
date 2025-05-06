<script lang="ts">
	import type { DuolingoScore } from '$lib/api/scores';
	import BarSet from './BarSet.svelte';
	import { BookOpen, Headphones, Mic, Pencil } from './icons';

	export let score: DuolingoScore;

	const maxValue = 160;

	const subScores = [
		{ label: 'Literacy', value: score.literacy, icon: BookOpen, maxValue },
		{ label: 'Comprehension', value: score.comprehension, icon: Headphones, maxValue },
		{ label: 'Conversation', value: score.conversation, icon: Mic, maxValue },
		{ label: 'Production', value: score.production, icon: Pencil, maxValue }
	];
</script>

<div class="grid grid-cols-4 gap-2">
	<BarSet {subScores} />
</div>

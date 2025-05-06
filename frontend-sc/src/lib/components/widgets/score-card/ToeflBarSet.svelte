<script lang="ts">
	import type { ToeflScore } from '$lib/api/scores';
	import BarSet from './BarSet.svelte';
	import { BookOpen, Headphones, Mic, Pencil } from './icons';

	export let score: ToeflScore;

	const maxValue = 30;

	const subScores = [
		{ label: 'Reading', value: score.reading, icon: BookOpen, maxValue },
		{ label: 'Listening', value: score.listening, icon: Headphones, maxValue },
		{ label: 'Speaking', value: score.speaking, icon: Mic, maxValue },
		{ label: 'Writing', value: score.writing, icon: Pencil, maxValue }
	];
</script>

<div class="grid grid-cols-4 gap-2">
	<BarSet {subScores} />
</div>

<script lang="ts">
	import type { ActScore } from '$lib/api/scores';
	import BarSet from './BarSet.svelte';
	import { SquareSigma, FlaskConical, BookOpen, LetterText } from './icons';

	export let score: ActScore;

	const maxValue = 36;

	const subScores = [
		{ label: 'Math', value: score.math, icon: SquareSigma, maxValue },
		{ label: 'Science', value: score.science, icon: FlaskConical, maxValue },
		{ label: 'English', value: score.english, icon: LetterText, maxValue },
		{ label: 'Reading', value: score.reading, icon: BookOpen, maxValue }
	];
</script>

<div class="grid grid-cols-4 gap-2">
	<BarSet {subScores} />
</div>

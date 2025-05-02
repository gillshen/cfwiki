<script lang="ts">
	import type { IeltsScore } from '$lib/api/scores';
	import BarSet from './BarSet.svelte';
	import { Ear, BookOpen, Mic, Pencil } from './icons';

	export let score: IeltsScore;

	const maxValue = 9.0;

	const subScores = [
		{ label: 'Reading', value: score.reading, icon: BookOpen, maxValue },
		{ label: 'Listening', value: score.listening, icon: Ear, maxValue },
		{ label: 'Speaking', value: score.speaking, icon: Mic, maxValue },
		{ label: 'Writing', value: score.writing, icon: Pencil, maxValue }
	];
</script>

<div class="grid grid-cols-4 gap-2">
	<BarSet {subScores} />
</div>

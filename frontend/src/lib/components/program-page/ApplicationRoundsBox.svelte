<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { slide } from 'svelte/transition';
	import { sineIn, sineInOut } from 'svelte/easing';
	import { ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import ApplicationRoundCard from '$lib/components/program-page/ApplicationRoundCard.svelte';
	import { groupByYearTerm } from '$lib/utils/applicationRoundUtils';
	import { yearIsRelevant } from '$lib/utils/dateUtils';

	export let applRounds: ApplicationRoundListItem[];
	export let deleteForm: SuperValidated<any>;

	const getYear = (key: string) => parseInt(key.split(' ')[1]);

	const applRoundsGrouped = Object.entries(groupByYearTerm(applRounds));
	let rowStates: Record<string, boolean> = {};

	for (const [key] of applRoundsGrouped) {
		rowStates[key] = yearIsRelevant(getYear(key));
	}
</script>

<article class="flex flex-col gap-6">
	{#each applRoundsGrouped as [key, rounds]}
		<div>
			<button
				class="text-sm font-medium mb-2 text-gray-700 flex gap-4 items-center"
				on:click={() => (rowStates[key] = !rowStates[key])}
			>
				<span>{key}</span>
				{#if rowStates[key]}
					<ChevronDownOutline />
				{:else}
					<ChevronRightOutline />
				{/if}
			</button>

			{#if rowStates[key]}
				<div
					class="grid grid-cols-3 gap-4"
					in:slide={{ duration: 300, easing: sineIn }}
					out:slide={{ duration: 300, easing: sineInOut }}
				>
					{#each rounds as applRound}
						<ApplicationRoundCard {applRound} {deleteForm} />
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</article>

<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';

	import type { BaseScore } from '$lib/api/scores';
	import ScoreSectionHeading from '$lib/components/student-page/ScoreSectionHeading.svelte';

	export let scores: BaseScore[];
	export let heading: string;
	export let firstTitle: string = 'Best single';
</script>

{#if scores.length}
	<ScoreSectionHeading title={heading} />
	<div class="scores-section">
		<Tabs
			tabStyle="none"
			divider={false}
			defaultClass="flex -mt-4"
			activeClasses="p-2 m-0 bg-stone-200 rounded-md"
			inactiveClasses="p-2 m-0 text-primary-500 hover:text-primary-700"
		>
			<TabItem open>
				<span slot="title">{scores.length > 1 ? firstTitle : 'Just one shot'}</span>
				<slot name="first" />
			</TabItem>

			<!-- TODO if scores.length goes from 2 to 1 while this tab is open, 
			 it does not update properly -->
			{#if scores.length > 1}
				<TabItem>
					<span slot="title">All {scores.length} attempts</span>
					<div class="flex flex-col divide-y-2 divide-dotted">
						<slot name="all" />
					</div>
				</TabItem>
			{/if}
		</Tabs>
	</div>
{/if}

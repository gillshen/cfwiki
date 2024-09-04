<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Popover, TableBodyCell } from 'flowbite-svelte';

	import type { ComposedApplicationListItem } from '$lib/api/application';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import PopoverScoreItem from '$lib/components/table-cells/PopoverScoreItem.svelte';
	import PopoverAlevelItem from '$lib/components/table-cells/PopoverAlevelItem.svelte';
	import PopoverMultiContainer from '$lib/components/table-cells/PopoverMultiContainer.svelte';
	import ScoreCount from '$lib/components/table-cells/ScoreCount.svelte';

	export let application: ComposedApplicationListItem;

	const { id, fullname, scores, ap_summary, ib_summary, alevel_summary } = application.student;

	$: noScore =
		!Object.keys(scores).length &&
		!Object.keys(ap_summary).length &&
		!Object.keys(ib_summary).length &&
		!Object.keys(alevel_summary).length;
</script>

<TableBodyCell class="max-w-20 font-normal">
	<div class="translate-y-0.5">
		<LinkWithIcon href={`/student/${id}`} text={fullname} iconFirst={true} />
	</div>
	<Popover
		placement="right"
		class="w-[360px]"
		defaultClass="p-0 m-0 z-50"
		transition={fade}
		params={{ duration: 200 }}
	>
		<div class="text-xl text-gray-900 font-medium px-6 py-3">{fullname}</div>

		<div class="px-6 pt-2 pb-6 flex items-start gap-6 flex-wrap">
			<PopoverScoreItem label="GRE" score={scores?.best_gre} />
			<PopoverScoreItem label="GMAT" score={scores?.best_gmat} />
			<PopoverScoreItem label="LSAT" score={scores?.best_lsat} />
			<PopoverScoreItem label="SAT" score={scores?.super_sat} />
			<PopoverScoreItem label="ACT" score={scores?.super_act} />
			<PopoverScoreItem label="TOEFL" score={scores?.best_toefl} />
			<PopoverScoreItem label="IELTS" score={scores?.best_ielts} />
			<PopoverScoreItem label="Duolingo" score={scores?.best_duolingo} />

			{#if ib_summary.final?.scale}
				<PopoverScoreItem
					label="IB final"
					score={`${ib_summary.final.total}/${ib_summary.final.scale}`}
				/>
			{/if}

			{#if ib_summary.predicted?.scale}
				<PopoverScoreItem
					label="IB pred."
					score={`${ib_summary.predicted.total}/${ib_summary.predicted.scale}`}
				/>
			{/if}

			{#if Object.keys(ap_summary).length}
				<PopoverMultiContainer label="AP">
					{#each Object.entries(ap_summary).sort( (a, b) => b[0].localeCompare(a[0]) ) as [score, count]}
						<ScoreCount {score} {count} />
					{/each}
				</PopoverMultiContainer>
			{/if}

			{#if alevel_summary.final}
				<PopoverAlevelItem items={alevel_summary.final} label="A-level final" />
			{/if}
			{#if alevel_summary.predicted}
				<PopoverAlevelItem items={alevel_summary.predicted} label="A-level pred." />
			{/if}

			{#if noScore}
				<div>No test scores</div>
			{/if}
		</div>
	</Popover>
</TableBodyCell>

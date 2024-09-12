<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Popover, TableBodyCell } from 'flowbite-svelte';

	import type { ComposedApplication } from '$lib/api/application';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import PopoverScoreItem from '$lib/components/table-cells/PopoverScoreItem.svelte';
	import PopoverAlevelItem from '$lib/components/table-cells/PopoverAlevelItem.svelte';
	import PopoverMultiContainer from '$lib/components/table-cells/PopoverMultiContainer.svelte';
	import ScoreCount from '$lib/components/table-cells/ScoreCount.svelte';
	import { formatGradeValue, summarizeByProgression } from '$lib/utils/gradesUtils';
	import { parseNum } from '$lib/utils/numUtils';

	export let application: ComposedApplication;

	const { id, fullname, enrollments, scores, ap_summary, ib_summary, alevel_summary } =
		application.student;

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
		<div class="text-xl text-gray-900 font-medium px-6 pt-4">{fullname}</div>

		<!-- TODO? filter for the most relevant school/program type -->
		{#each enrollments as e}
			<div class="mx-6 mt-4 p-4 flex flex-col gap-1 border-[1px] border-solid rounded-lg">
				<div class="font-medium mb-2 text-gray-700">{e.school_name}</div>

				{#if e.grades.length}
					<div class="flex flex-col gap-2">
						{#each summarizeByProgression(e.grades) as { progression, scale, value, comments }}
							<div class="flex items-center gap-4">
								<div class="min-w-8 font-medium">{progression}</div>

								<div class="flex">
									{#if parseNum(scale)}
										<span class="text-gray-900 font-medium tabular-nums">
											{formatGradeValue(value, scale)}
										</span>
										<span class="tabular-nums">/{formatGradeValue(scale)}</span>
									{:else}
										<span class="text-gray-900 truncate">{comments}</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-gray-500">No grade info</div>
				{/if}
			</div>
		{/each}

		<div class="px-6 pt-4 pb-6 flex items-start gap-6 flex-wrap">
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

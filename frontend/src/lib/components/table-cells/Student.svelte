<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Popover, TableBodyCell } from 'flowbite-svelte';

	import type { ApplicationListItem } from '$lib/api/application';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import PopoverScoreItem from '$lib/components/table-cells/PopoverScoreItem.svelte';

	export let application: ApplicationListItem;

	const {
		id,
		fullname,
		best_toefl,
		best_ielts,
		best_duolingo,
		super_sat,
		super_act,
		best_gre,
		best_gmat,
		best_lsat
	} = application.student;

	$: noScore =
		best_toefl === null &&
		best_ielts === null &&
		best_duolingo === null &&
		super_sat === null &&
		super_act === null &&
		best_gre === null &&
		best_gmat === null &&
		best_lsat === null;
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

		<div class="px-6 pt-2 pb-6 flex gap-4">
			<PopoverScoreItem label="GRE" score={best_gre} />
			<PopoverScoreItem label="GMAT" score={best_gmat} />
			<PopoverScoreItem label="LSAT" score={best_lsat} />
			<PopoverScoreItem label="SAT" score={super_sat} />
			<PopoverScoreItem label="ACT" score={super_act} />
			<PopoverScoreItem label="TOEFL" score={best_toefl} />
			<PopoverScoreItem label="IELTS" score={best_ielts} />
			<PopoverScoreItem label="Duolingo" score={best_duolingo} />
			{#if noScore}
				<div>No test scores</div>
			{/if}
		</div>
	</Popover>
</TableBodyCell>

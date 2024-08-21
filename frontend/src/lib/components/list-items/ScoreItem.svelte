<script lang="ts">
	import { Dropdown, Avatar, type SizeType } from 'flowbite-svelte';

	import { toShortYearMonth } from '$lib/utils/dateUtils';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';

	export let subject: string;
	export let score: number | string | null;
	export let date: string | null;
	export let size: SizeType = 'md';
	export let canEdit: boolean = false;
	export let updateAction: () => any = () => {};
	export let deleteAction: () => any = () => {};
</script>

<div class="flex gap-2 mb-4 items-center h-fit">
	<Avatar {size} class="bg-primary-700 text-white flex-shrink-0">{score ?? '?'}</Avatar>

	<div class="flex flex-col gap-0.5 text-sm truncate">
		{#if canEdit}
			<div
				class="font-medium cursor-pointer text-gray-900 hover:text-primary-700 hover:underline truncate"
			>
				{subject}
			</div>
			<Dropdown>
				<DropdownActionItem text="Update" onClick={updateAction} />
				<DropdownActionItem text="Delete" onClick={deleteAction} dark />
			</Dropdown>
		{:else}
			<div class="font-medium text-gray-900 truncate">{subject}</div>
		{/if}
		<div class="text-sm flex gap-1 text-gray-400">
			<span>{toShortYearMonth(date) || 'Undated'}</span>
			<slot name="note" />
		</div>
	</div>
</div>

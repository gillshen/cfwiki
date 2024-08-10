<script lang="ts">
	import type { SizeType } from 'flowbite-svelte';
	import { Avatar, A } from 'flowbite-svelte';
	import { toShortYearMonth } from '$lib/utils/dateUtils';

	export let subject: string;
	export let score: number | string | null;
	export let date: string | null;
	export let size: SizeType = 'md';
	export let onClick: () => any = () => {};
</script>

<div class="flex gap-2 mb-4 items-center h-fit">
	<Avatar {size} class="bg-primary-700 text-white">{score ?? '?'}</Avatar>

	<div class="flex flex-col gap-0.5 text-sm">
		<A
			on:click={onClick}
			class="font-medium text-gray-900 hover:text-primary-700 hover:no-underline"
		>
			{subject}
		</A>
		<div class="text-sm flex gap-1 text-gray-400">
			<span>{toShortYearMonth(date) || 'Undated'}</span>
			<slot name="note" />
		</div>
	</div>
</div>

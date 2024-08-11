<script lang="ts">
	import { Dropdown, DropdownDivider } from 'flowbite-svelte';

	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';

	type DropdownAction = {
		text: string;
		action: () => void;
		divider?: boolean;
		dark?: boolean;
	};

	export let actions: DropdownAction[];
	export let text: string = '';
</script>

<div class="flex gap-2 items-center w-fit text-primary-700 hover:underline hover:cursor-pointer">
	<slot name="icon" />
	{#if text}
		<span class="text-sm font-medium">{text}</span>
	{/if}
</div>
<Dropdown class="w-40 z-20" placement="right">
	{#each actions as { text, action, divider, dark }}
		{#if divider}
			<DropdownDivider />
		{/if}
		<DropdownActionItem {text} onClick={action} dark={!!dark} />
	{/each}
</Dropdown>

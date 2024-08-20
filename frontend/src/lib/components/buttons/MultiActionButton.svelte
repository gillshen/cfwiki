<script lang="ts">
	import { Dropdown, DropdownDivider } from 'flowbite-svelte';

	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';

	type DropdownAction = {
		text: string;
		action: () => void;
		divider?: boolean;
		dark?: boolean;
		disabled?: boolean;
	};

	export let actions: DropdownAction[];
	export let text: string = '';
	export let placement: 'right' | 'right-start' | 'right-end' = 'right';
	export let disabled: boolean = false;
</script>

<div
	class={`flex gap-2 items-center w-fit  ${disabled ? 'text-gray-400' : 'text-primary-700 hover:underline hover:cursor-pointer'}`}
>
	<slot name="icon" />
	{#if text}
		<span class="text-sm font-medium">{text}</span>
	{/if}
</div>
<Dropdown class="w-fit min-w-40 z-20" {placement}>
	{#each actions as { text, action, divider, dark, disabled }}
		{#if divider}
			<DropdownDivider />
		{/if}
		<DropdownActionItem {text} onClick={action} dark={!!dark} {disabled} />
	{/each}
</Dropdown>

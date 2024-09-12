<script lang="ts">
	import { Dropdown, DropdownDivider } from 'flowbite-svelte';

	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import Button from '$lib/components/buttons/Button.svelte';

	type DropdownAction = {
		text: string;
		action: () => void;
		divider?: boolean;
		dark?: boolean;
		disabled?: boolean;
	};

	export let actions: DropdownAction[];
	export let text: string = '';
	export let icon: any | undefined = undefined;
	export let placement: 'right' | 'right-start' | 'right-end' = 'right';
	export let disabled: boolean = false;
</script>

<Button onClick={() => {}} {text} {icon} {disabled} />

<Dropdown class="w-fit min-w-40 z-20 bg-stone-50" {placement}>
	{#each actions as { text, action, divider, dark, disabled }}
		{#if divider}
			<DropdownDivider />
		{/if}
		<DropdownActionItem {text} onClick={action} dark={!!dark} {disabled} />
	{/each}
</Dropdown>

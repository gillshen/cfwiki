<script lang="ts">
	import { tick } from 'svelte';

	import { cn } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Command from '$lib/components/ui/command/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Check from 'lucide-svelte/icons/check';

	import { normalizeSelectItems, type SelectOption } from '$lib/util/formUtils';

	export let value: string;
	export let items: (SelectOption | string | number)[];
	export let width: string = 'w-[360px]';
	export let inputClass: string = '';
	export let placeholder: string = 'Search\u200a...';
	export let disableSearch: boolean = false;
	export let emptyText: string | undefined = undefined;
	export let searchDisabledEmptyText: string | undefined = undefined;
	export let onSelect: () => void = () => {};

	$: normalizedItems = items.map(normalizeSelectItems);

	$: selectedValue = normalizedItems.find((it) => it.value === value)?.label ?? '';

	let open = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class={cn('justify-between font-normal', width, !selectedValue && 'text-muted-foreground')}
		>
			{selectedValue || 'Select an option'}
			<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class={cn('p-0', inputClass, width)}>
		<Command.Root>
			{#if !disableSearch}
				<Command.Input {placeholder} class="h-9" />
			{/if}
			<Command.Empty>
				<p>
					{disableSearch
						? (searchDisabledEmptyText ?? 'No options available')
						: (emptyText ?? 'No matching options found')}
				</p>
				<slot name="if-not-found" />
			</Command.Empty>
			<Command.List>
				{#each normalizedItems as item}
					<Command.Item
						value={item.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
							onSelect();
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== item.value && 'text-transparent')} />
						{item.label}
					</Command.Item>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

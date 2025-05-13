<script lang="ts">
	import { tick } from 'svelte';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Command from '$lib/components/ui/command/index';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button/index';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Check from 'lucide-svelte/icons/check';

	import { normalizeSelectItems, type SelectOption } from '$lib/util/formUtils';
	import DismissibleBadge from '$lib/components/misc/DismissibleBadge.svelte';

	type AnySchema = Record<string, unknown>;
	type T = $$Generic<AnySchema>;

	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	export let label: string;
	export let items: (SelectOption | string | number)[];
	export let width: string = 'w-[360px]';
	export let description: string | boolean = false;
	export let labelClass: string = '';
	export let inputClass: string = '';
	export let placeholder: string = 'Search\u200a...';
	export let optional: boolean = false;
	export let disableSearch: boolean = false;
	export let emptyText: string | undefined = undefined;
	export let searchDisabledEmptyText: string | undefined = undefined;
	export let onSelect: () => void = () => {};
	export let postSelect: () => void = () => {};
	export let transformValue: (value: any) => any = (value: any) => value;
	export let className: string = '';
	export { className as class };

	const { form: formData } = form;
	const id = `multi-select-${Math.random().toString()}`;

	$: normalizedItems = items.map(normalizeSelectItems);

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

	const addValue = (value: any) => {
		const transformed = transformValue(value);
		if (transformed !== undefined && !fieldData.includes(transformed)) {
			$formData[name] = [...fieldData, transformed] as T[FormPath<T>];
			selectedValues = [...selectedValues, value];
		}
	};

	const removeValue = (value: any) => {
		const transformed = transformValue(value);
		$formData[name] = fieldData.filter((it) => it !== transformed) as T[FormPath<T>];
		selectedValues = selectedValues.filter((it) => it !== value);
	};

	// Keep track of selected items
	let selectedValues: string[] = [];

	// Type coercion to stop TS from complaining
	$: fieldData = $formData[name] as unknown[];
</script>

<Form.Field {form} {name} class={cn('flex flex-col text-left', className)}>
	<Popover.Root bind:open let:ids>
		<Form.Control let:attrs>
			<Form.Label
				for={id}
				class={cn('h-4 flex items-center gap-1', optional ? 'optional-field' : '', labelClass)}
				>{label}</Form.Label
			>
			<Popover.Trigger
				role="combobox"
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'justify-between font-normal h-fit group',
					width,
					fieldData.length ? 'px-2' : 'text-muted-foreground'
				)}
				{...attrs}
			>
				{#if fieldData.length}
					<div class="flex flex-wrap justify-start gap-2 h-fit">
						{#each fieldData as transformedValue}
							{@const item = normalizedItems.find(
								(it) => transformValue(it.value) === transformedValue
							)}
							<DismissibleBadge
								class="h-7 rounded-sm group-hover:ring-1 ring-muted-foreground"
								onDismiss={() => removeValue(item?.value)}>{item?.label}</DismissibleBadge
							>
						{/each}
					</div>
				{:else}
					<span class="truncate"> Select one or more options</span>
				{/if}
				<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Popover.Trigger>
			<select {id} {name} multiple hidden bind:value={$formData[name]}>
				{#each normalizedItems as { label, value }}
					<option value={transformValue(value)}>{label}</option>
				{/each}
			</select>
		</Form.Control>
		<Popover.Content class={cn('p-0', inputClass, width)}>
			<Command.Root>
				{#if !disableSearch}
					<Command.Input {placeholder} />
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
							{...form}
							class="flex gap-2 items-center"
							value={item.value}
							onSelect={() => {
								// Order of operation critical:
								closeAndFocusTrigger(ids.trigger);
								onSelect();
								addValue(item.value);
								postSelect();
							}}
						>
							<Check
								class={cn(
									'size-4 shrink-0',
									fieldData.includes(transformValue(item.value)) ? 'opacity-100' : 'opacity-0'
								)}
							/>
							<div>{item.label}</div>
						</Command.Item>
					{/each}
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	{#if description}
		<Form.Description class="text-xs">
			{#if typeof description === 'string'}
				{description}
			{/if}
			<slot name="description" />
		</Form.Description>
	{/if}
	<Form.FieldErrors />
</Form.Field>

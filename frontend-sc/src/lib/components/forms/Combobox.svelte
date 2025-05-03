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

	import { updateStore } from '$lib/util/siteUtils';
	import { normalizeSelectItems, type SelectOption } from '$lib/util/formUtils';

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
	export let className: string = '';
	export { className as class };

	const { form: formData } = form;

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
</script>

<Form.Field {form} {name} class={cn('flex flex-col text-left', className)}>
	<Popover.Root bind:open let:ids>
		<Form.Control let:attrs>
			<Form.Label class={cn('pb-0.5', optional ? 'optional-field' : '', labelClass)}
				>{label}</Form.Label
			>
			<Popover.Trigger
				role="combobox"
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'justify-between font-normal',
					width,
					!$formData[name] && 'text-muted-foreground'
				)}
				{...attrs}
			>
				<span class="truncate"
					>{normalizedItems.find((item) => item.value === $formData[name])?.label ||
						'Select an option'}</span
				>
				<ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Popover.Trigger>
			<input hidden value={$formData[name]} name={attrs.name} />
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
								// Update form data (calling a function as TS would complain
								// about writing "$formData[name] = item.value" here directly
								updateStore(form.form, name, item.value);
								postSelect();
							}}
						>
							<Check
								class={cn(
									'size-4 shrink-0',
									item.value === $formData[name] ? 'opacity-100' : 'opacity-0'
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

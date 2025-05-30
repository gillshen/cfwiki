<script lang="ts">
	import { cn } from '$lib/utils';

	import * as Form from '$lib/components/ui/form/index';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import { normalizeSelectItems, type SelectOption } from '$lib/util/formUtils';

	type AnySchema = Record<string, unknown>;
	type T = $$Generic<AnySchema>;

	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	export let label: string;
	export let items: (SelectOption | string | number)[];
	export let onValueChange: (value?: string | undefined) => void = () => {};
	export let labelClass: string = '';

	const { form: formData } = form;
</script>

<Form.Fieldset {form} {name}>
	<Form.Legend class={cn('pb-1.5', labelClass)}>{label}</Form.Legend>
	<Form.Control>
		<RadioGroup.Root
			bind:value={//
			// changed the type of `defaultvalue` from string to any
			// on line 38 of
			// node_modules/@melt-ui/svelte/dist/builders/radio-group/types.d.ts
			// to stop TS from complaining
			$formData[name]}
			{onValueChange}
		>
			{#each items.map(normalizeSelectItems) as item}
				<div class="flex items-center space-x-3">
					<Form.Control let:attrs>
						<RadioGroup.Item value={item.value} {...attrs} />
						<Form.Label class="font-normal">{item.label}</Form.Label>
					</Form.Control>
				</div>
			{/each}
			<RadioGroup.Input {name} />
		</RadioGroup.Root>
	</Form.Control>
	<Form.FieldErrors />
</Form.Fieldset>

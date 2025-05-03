<script lang="ts">
	import type { SuperForm, FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Input from '$lib/components/ui/input/input.svelte';
	import { cn } from '$lib/utils';

	type AnySchema = Record<string, unknown>;
	type T = $$Generic<AnySchema>;

	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	export let label: string;
	export let description: string | boolean = false;
	export let labelClass: string = '';
	export let inputClass: string = '';
	export let type: 'text' | 'number' | 'date' | 'password' = 'text';
	export let placeholder: string = '';
	export let optional: boolean = false;
	export let maxlength: number | undefined = undefined;
	export let className: string = '';
	export { className as class };

	const { form: formData } = form;
</script>

<Form.Field {form} {name} class={className}>
	<Form.Control let:attrs>
		<Form.Label class={cn(optional ? 'optional-field' : '', labelClass)}>{label}</Form.Label>
		<Input
			{type}
			{placeholder}
			{maxlength}
			class={cn('w-[360px]', inputClass)}
			{...attrs}
			bind:value={$formData[name]}
		/>
		{#if description}
			<Form.Description class="text-xs">
				{#if typeof description === 'string'}
					{description}
				{/if}
				<slot name="description" />
			</Form.Description>
		{/if}
		<Form.FieldErrors />
	</Form.Control>
</Form.Field>

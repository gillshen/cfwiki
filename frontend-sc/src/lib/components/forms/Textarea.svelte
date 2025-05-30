<script lang="ts">
	import type { SuperForm, FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { cn } from '$lib/utils';

	type AnySchema = Record<string, unknown>;
	type T = $$Generic<AnySchema>;

	export let form: SuperForm<T>;
	export let name: FormPath<T>;
	export let label: string;
	export let description: string | boolean = false;
	export let labelClass: string = '';
	export let textareaClass: string = '';
	export let placeholder: string = '';
	export let optional: boolean = false;
	export let maxlength: number | undefined = undefined;
	export let rows: number = 5;
	export let className: string = '';
	export { className as class };

	const { form: formData } = form;

	// Implement reactivity
	function handleInput(event: Event) {
		const value = (event.target as HTMLTextAreaElement).value;
		$formData[name] = value as any;
	}
</script>

<Form.Field {form} {name} class={className}>
	<Form.Control let:attrs>
		<Form.Label
			class={cn('h-4 flex items-center gap-1', optional ? 'optional-field' : '', labelClass)}
			>{label}</Form.Label
		>

		<Textarea
			{placeholder}
			{maxlength}
			{rows}
			class={cn('w-[450px] max-w-[450px]', textareaClass)}
			{...attrs}
			value={String($formData[name] ?? '')}
			on:input={handleInput}
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

<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import FormButton from '$lib/components/ui/form/form-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { DeleteSchema } from '$lib/schemas/delete';

	export let superValidated: SuperValidated<Infer<DeleteSchema>>;
	export let action: string;
	export let objectId: number;
	export let formId: string = '';
	export let deleteButtonText: string = 'Delete';
	export let onUpdated:
		| ((event: { form: SuperValidated<Infer<DeleteSchema>> }) => any)
		| undefined = undefined;
	export let onCancel: (() => any) | undefined = undefined;
	export let className: string = '';
	export { className as class };

	const id: string = formId ?? `delete-form-${objectId}`;
	const { form: formData, enhance } = superForm(superValidated, { id, onUpdated });

	$formData.id = objectId;
</script>

<form
	method="POST"
	{action}
	{id}
	class={cn('mx-auto my-2 w-fit grid grid-cols-2 gap-2 justify-stretch', className)}
	use:enhance
>
	<input type="number" name="id" bind:value={$formData.id} hidden />

	<FormButton variant="destructive">{deleteButtonText}</FormButton>
	<Button type="button" variant="ghost" on:click={onCancel}>Cancel</Button>
</form>

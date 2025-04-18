<script lang="ts">
	import type { SuperForm, Infer } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import Combobox from '$lib/components/forms/Combobox.svelte';
	import type { ApplicationLogSchema } from '$lib/schemas/applicationLog';
	import type { ApplicationDetail } from '$lib/api/application';
	import { applicationStatuses } from '$lib/api/applicationLog';

	export let form: SuperForm<Infer<ApplicationLogSchema>>;
	export let application: ApplicationDetail;

	const { form: formData } = form;
</script>

<Combobox
	{form}
	name="status"
	label="Status"
	items={applicationStatuses.map((status) => ({ value: status, label: status }))}
/>

<FormField {form} name="date">
	<Form.Control let:attrs>
		<Form.Label>Date</Form.Label>
		<Input type="date" class="w-[360px]" {...attrs} bind:value={$formData.date} />
	</Form.Control>
	<Form.FieldErrors />
</FormField>

<FormField {form} name="comments" class="pt-1">
	<Form.Control let:attrs>
		<Form.Label class="optional-field">Comments</Form.Label>
		<Textarea rows={4} maxlength={1000} {...attrs} bind:value={$formData.comments} />
	</Form.Control>
</FormField>

<input type="number" name="id" bind:value={$formData.id} hidden />
<input type="number" name="application" bind:value={application.id} hidden />

<Form.Button class="w-fit min-w-24">Submit</Form.Button>

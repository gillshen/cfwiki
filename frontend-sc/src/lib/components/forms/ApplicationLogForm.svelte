<script lang="ts">
	import type { SuperForm, Infer } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form/index';
	import Textarea from '$lib/components/forms/Textarea.svelte';

	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import type { ApplicationLogSchema } from '$lib/schemas/applicationLog';
	import type { ApplicationDetail } from '$lib/api/application';
	import { APPLICATION_STATUSES } from '$lib/api/applicationLog';

	export let form: SuperForm<Infer<ApplicationLogSchema>>;
	export let application: ApplicationDetail;

	const { form: formData } = form;
</script>

<Combobox {form} name="status" label="Status" items={[...APPLICATION_STATUSES]} />
<Input {form} name="date" label="Date" type="date" class="pb-1" />
<Textarea {form} name="comments" label="Comments" maxlength={1000} optional />

<input type="number" name="id" bind:value={$formData.id} hidden />
<input type="number" name="application" bind:value={application.id} hidden />

<Form.Button class="w-fit min-w-24">Submit</Form.Button>

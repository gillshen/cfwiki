<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Button, Modal } from 'flowbite-svelte';
	import NameFields from '$lib/components/program-form/NameFields.svelte';

	export let data;

	const { form, enhance } = superForm(data.programForm, {
		invalidateAll: 'force',
		onUpdated({ form }) {
			if (form.valid) {
				updateProgramModal = false;
			}
		}
	});

	let updateProgramModal = false;
</script>

<pre class="text-sm bg-gray-50">{JSON.stringify(data.program, null, 2)}</pre>

<div class="p-8">
	<Button on:click={() => (updateProgramModal = true)}>Update</Button>
</div>

<Modal title="Update the program" bind:open={updateProgramModal} outsideclose>
	<form class="modal" method="post" action="?/updateProgram" use:enhance>
		<input type="number" name="id" class="hidden" value={$form.id} />
		<NameFields {form} required />
		<div class="pt-8">
			<Button type="submit">Submit</Button>
		</div>
	</form>
</Modal>

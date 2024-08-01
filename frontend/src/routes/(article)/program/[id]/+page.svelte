<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Button, Heading, Hr, Modal } from 'flowbite-svelte';
	import NameFields from '$lib/components/program-form/NameFields.svelte';

	export let data;

	let updateProgramModal = false;

	const { form, enhance } = superForm(data.programForm, {
		invalidateAll: 'force',
		onUpdated({ form }) {
			if (form.valid) {
				updateProgramModal = false;
			}
		}
	});
</script>

<Heading tag="h1" class="alt-page-title">{data.program.display_name}</Heading>

<Hr />

<pre class="text-sm bg-gray-50">{JSON.stringify(data.program, null, 2)}</pre>

{#if data.program.type === "Master's"}
	<Button class="mt-8" on:click={() => (updateProgramModal = true)}>Update</Button>
{/if}

<Modal title="Update program information" bind:open={updateProgramModal} outsideclose>
	<form class="modal" method="post" action="?/updateProgram" use:enhance>
		<input type="number" name="id" class="hidden" value={$form.id} />
		<div class="form-width mx-auto my-8">
			<NameFields {form} requireDegree={data.program.type === "Master's"} />
			<Button class="mt-8" type="submit">Submit</Button>
		</div>
	</form>
</Modal>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Button, Heading, Hr, Dropdown, Modal } from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';

	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import NameFields from '$lib/components/program-form/NameFields.svelte';
	import { formatSchoolNamesShort, isUndergraduate } from '$lib/api/program';

	export let data;

	let updateProgramModal = false;

	const { form, enhance } = superForm(data.programForm, {
		onUpdated({ form }) {
			if (form.valid) {
				updateProgramModal = false;
			}
		},
		invalidateAll: 'force'
	});
</script>

<Heading tag="h1" class="alt-page-title"
	>{formatSchoolNamesShort(data.program)} | {data.program.display_name}</Heading
>

<Hr />

<section class="flex gap-24">
	<div class="w-[36rem] min-w-[32rem] pb-8">
		<ProgramInfobox program={data.program} />

		<div class="flex gap-x-8 mt-8">
			<Button outline>Actions<ChevronRightOutline class="w-6 h-6 ms-1" /></Button>
			<Dropdown class="w-40 z-20" placement="right-start">
				{#if !isUndergraduate(data.program)}
					<DropdownActionItem text="Update" onClick={() => (updateProgramModal = true)} />
				{/if}
				<DropdownActionItem text="Delete" onClick={() => alert('delete school file')} dark />
			</Dropdown>
		</div>
	</div>

	<div class="bg-slate-50 rounded-xl w-full min-w-[32rem] p-8 text-gray-400">(applications)</div>
</section>

<Modal title="Update program information" bind:open={updateProgramModal} outsideclose>
	<form class="modal" method="post" action="?/updateProgram" use:enhance>
		<input type="number" name="id" class="hidden" value={$form.id} />
		<div class="form-width mx-auto my-8">
			<NameFields {form} requireDegree={data.program.type === "Master's"} />
			<Button class="mt-8" type="submit">Submit</Button>
		</div>
	</form>
</Modal>

<script lang="ts">
	import { Heading, Hr } from 'flowbite-svelte';
	import { PenOutline } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import { formatSchoolNamesShort, isUndergraduate } from '$lib/api/program';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';
	import MultiActionButton from '$lib/components/buttons/MultiActionButton.svelte';

	export let data;

	let updateProgramModal = false;

	const updateAction = {
		text: 'Update',
		action: () => (updateProgramModal = true),
		disabled: isUndergraduate(data.program)
	};

	const deleteAction = {
		text: 'Delete',
		action: () => alert('delete program'),
		dark: true,
		disabled: false // TODO if applied to, set to true
	};
</script>

<Heading tag="h1" class="alt-page-title">
	{formatSchoolNamesShort(data.program)} | {data.program.display_name}
</Heading>

<Hr />

<Main>
	<article>
		<ProgramInfobox program={data.program} />

		<div class="mt-8">
			<MultiActionButton text="Actions" actions={[updateAction, deleteAction]}>
				<PenOutline slot="icon" />
			</MultiActionButton>
		</div>
	</article>

	<article class="bg-slate-50 rounded-xl w-full text-gray-400 p-8">(applications)</article>
</Main>

<FormModal
	open={updateProgramModal}
	superform={data.programForm}
	fields={ProgramForm}
	action="?/updateProgram"
	entity={data.program}
	extra={[{ name: 'id', type: 'number', value: data.program.id }]}
	title="Update program information"
	on:close={() => (updateProgramModal = false)}
/>

<script lang="ts">
	import { Button, Heading, Hr, Dropdown } from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';

	import ProgramInfobox from '$lib/components/infobox/ProgramInfobox.svelte';
	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import { formatSchoolNamesShort, isUndergraduate } from '$lib/api/program';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import ProgramForm from '$lib/components/program-form/ProgramForm.svelte';

	export let data;

	let updateProgramModal = false;
</script>

<Heading tag="h1" class="alt-page-title">
	{formatSchoolNamesShort(data.program)} | {data.program.display_name}
</Heading>

<Hr />

<section class="flex gap-24">
	<article class="w-[36rem] min-w-[32rem] pb-8">
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
	</article>

	<article class="bg-slate-50 rounded-xl w-full min-w-[32rem] p-8 text-gray-400">
		(applications)
	</article>
</section>

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

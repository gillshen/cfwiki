<script lang="ts">
	import { Button, Heading, Hr, Dropdown, Modal } from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import SchoolInfobox from '$lib/components/infobox/SchoolInfobox.svelte';

	export let data;

	let updateSchoolModal = false;

	const { form, enhance } = superForm(data.schoolForm, {
		invalidateAll: 'force',
		onUpdated({ form }) {
			if (form.valid) {
				updateSchoolModal = false;
			}
		}
	});
</script>

<Heading tag="h1" class="alt-page-title">{data.school.name}</Heading>

<Hr />

<section class="flex gap-24">
	<article class="w-[36rem] min-w-[32rem] pb-8">
		<SchoolInfobox school={data.school} />

		<div class="flex gap-x-8 mt-8">
			<Button outline>Actions<ChevronRightOutline class="w-6 h-6 ms-1" /></Button>
			<Dropdown class="w-40 z-20" placement="right-start">
				<DropdownActionItem text="Update" onClick={() => (updateSchoolModal = true)} />
				<DropdownActionItem text="Delete" onClick={() => alert('delete school file')} dark />
			</Dropdown>
		</div>
	</article>

	<article class="bg-slate-50 rounded-xl w-full min-w-[32rem] p-8 text-gray-400">
		(applications)
	</article>
</section>

<Modal title="Update school information" bind:open={updateSchoolModal} outsideclose>
	<form class="modal" method="post" action="?/updateSchool" use:enhance>
		<input type="number" name="id" class="hidden" bind:value={data.school.id} />
		<div class="form-width mx-auto">
			<SchoolForm {form} submitButtonText="Update" typeField={false} />
		</div>
	</form>
</Modal>

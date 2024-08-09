<script lang="ts">
	import { Button, Heading, Hr, Dropdown } from 'flowbite-svelte';
	import { ChevronRightOutline } from 'flowbite-svelte-icons';

	import DropdownActionItem from '$lib/components/list-items/DropdownActionItem.svelte';
	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import SchoolInfobox from '$lib/components/infobox/SchoolInfobox.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';

	export let data;

	let updateSchoolModal = false;
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

<FormModal
	open={updateSchoolModal}
	superform={data.schoolForm}
	fields={SchoolForm}
	action="?/updateSchool"
	entity={data.school}
	extra={[{ name: 'id', type: 'number', value: data.school.id }]}
	title="Update school information"
	on:close={() => (updateSchoolModal = false)}
/>

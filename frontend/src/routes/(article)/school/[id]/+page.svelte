<script lang="ts">
	import { Heading, Hr } from 'flowbite-svelte';

	import Main from '$lib/components/containers/Main.svelte';
	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import SchoolInfobox from '$lib/components/infobox/SchoolInfobox.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';

	export let data;

	let updateSchoolModal = false;
</script>

<Heading tag="h1" class="alt-page-title">{data.school.name}</Heading>

<Hr />

<Main>
	<article>
		<SchoolInfobox school={data.school} />

		<div class="mt-8">
			<UpdateDeleteButton
				text="Actions"
				updateAction={() => (updateSchoolModal = true)}
				deleteAction={() => alert('delete')}
			/>
		</div>
	</article>

	<article class="bg-slate-50 rounded-xl w-full p-8 text-gray-400">(applications)</article>
</Main>

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

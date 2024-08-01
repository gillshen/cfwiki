<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Button,
		Heading,
		Hr,
		Modal
	} from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import countryFlags from '$lib/constants/countryFlags';

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

<div class="w-[36rem] pb-8">
	<Table>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Type</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.school.type}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Full name</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.school.name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Alt. name</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.school.alt_name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Country</TableBodyCell>
				<TableBodyCell tdClass="font-normal">
					<div class="flex gap-2">
						<div>{countryFlags[data.school.country]}</div>
						<div>{data.school.country}</div>
					</div>
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="px-0 py-6">
					<Button outline on:click={() => (updateSchoolModal = true)}>Update</Button>
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</div>

<Modal title="Update school information" bind:open={updateSchoolModal} outsideclose>
	<form class="modal" method="post" action="?/updateSchool" use:enhance>
		<input type="number" name="id" class="hidden" bind:value={data.school.id} />
		<div class="form-width mx-auto">
			<SchoolForm {form} submitButtonText="Update" typeField={false} />
		</div>
	</form>
</Modal>

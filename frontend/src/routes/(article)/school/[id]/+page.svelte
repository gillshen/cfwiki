<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Button,
		Heading,
		Hr
	} from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	import SchoolForm from '$lib/components/school-form/SchoolForm.svelte';
	import countryFlags from '$lib/constants/countryFlags';

	export let data;

	let formOpen = false;

	const { form, enhance } = superForm(data.schoolForm, {
		invalidateAll: 'force',
		onUpdated({ form }) {
			if (form.valid) {
				formOpen = false;
			}
		}
	});
</script>

<Heading tag="h1" class="px-8 py-6 font-normal">{data.school.name}</Heading>

<div class="w-[36rem] px-8 py-6">
	<Table>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Full name</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.school.name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Alt. name</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.school.alt_name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Type</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.school.type}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Country</TableBodyCell>
				<TableBodyCell tdClass="font-normal">
					<div class="flex gap-2">
						<div>{countryFlags[data.school.country]}</div>
						<div>{data.school.country}</div>
					</div>
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell></TableBodyCell>
				<TableBodyCell>
					<div class="text-right">
						<Button outline on:click={() => (formOpen = true)}>Update</Button>
					</div>
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</div>

<div class={`w-[36rem] px-8 py-6 ${formOpen ? '' : 'hidden'}`}>
	<Hr />

	<form method="post" action="?/updateSchool" use:enhance>
		<input type="number" name="id" class="hidden" bind:value={data.school.id} />

		<SchoolForm {form} submitButtonText="Update" />
	</form>
</div>

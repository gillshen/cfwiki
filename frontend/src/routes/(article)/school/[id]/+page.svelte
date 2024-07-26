<script lang="ts">
	import countryFlags, { sortMostAppliedFirst } from '$lib/constants/countryFlags';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Button,
		Heading,
		Input,
		Label,
		Select,
		Hr
	} from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance } = superForm(data.schoolForm, { invalidateAll: 'force' });
	const countries = Object.keys(countryFlags).sort(sortMostAppliedFirst);
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
		</TableBody>
	</Table>
</div>

<div class="w-[36rem] px-8 py-6">
	<Hr />

	<form method="post" action="?/updateSchool" use:enhance>
		<input type="number" name="id" class="hidden" bind:value={data.school.id} />

		<div class="w-[30rem] px-6">
			<Label for="school-name" class="form-label">Full name</Label>
			<Input id="school-name" type="text" name="name" bind:value={$form.name} />

			<Label for="school-alt-name" class="form-label optional">Abbreviation or nickname</Label>
			<Input id="school-alt-name" type="text" name="alt_name" bind:value={$form.alt_name} />

			<Label for="school-type" class="form-label">Type</Label>
			<Select id="school-type" name="type" bind:value={$form.type}>
				{#each ['University', 'Secondary School', 'Other'] as schoolType}
					<option value={schoolType}>{schoolType}</option>
				{/each}
			</Select>

			<Label for="school-country" class="form-label">Country</Label>
			<Select id="school-country" name="country" bind:value={$form.country}>
				{#each countries as country}
					<option value={country}>{countryFlags[country]}&nbsp;&nbsp;{country}</option>
				{/each}
			</Select>

			<div class="mt-8">
				<Button type="submit">Update</Button>
			</div>
		</div>
	</form>
</div>

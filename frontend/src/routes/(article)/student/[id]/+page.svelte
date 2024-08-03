<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import {
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Button,
		Heading,
		Hr
	} from 'flowbite-svelte';

	import countryFlags from '$lib/constants/countryFlags';
	import { formatLocation } from '$lib/api/student';
	import { toLongDate } from '$lib/utils/dateUtils';
	import ContractForm from '$lib/components/contract-form/ContractForm.svelte';

	export let data;

	const { form, enhance } = superForm(data.newContractForm);

	const formatGender = (gender: string): string => {
		switch (gender) {
			case 'female':
				return 'Female';
			case 'male':
				return 'Male';
			default:
				return gender;
		}
	};
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname}</Heading>

<Hr />

<div class="w-[36rem] pb-8">
	<Table>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Preferred name</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.student.preferred_name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Gender</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{formatGender(data.student.gender)}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Citizenship</TableBodyCell>
				<TableBodyCell tdClass="font-normal">
					<div class="flex gap-2">
						<div>{countryFlags[data.student.citizenship]}</div>
						<div>{data.student.citizenship}</div>
					</div>
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Home</TableBodyCell>
				<TableBodyCell tdClass="font-normal">
					{#if data.student.base_country}
						<div class="flex gap-2">
							<div>{countryFlags[data.student.base_country]}</div>
							<div>{formatLocation(data.student)}</div>
						</div>
					{/if}
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium py-4">Date of birth</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{toLongDate(data.student.date_of_birth)}</TableBodyCell
				>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="align-top w-48 font-medium py-4">
					<div>Comments</div>
				</TableBodyCell>
				<TableBodyCell tdClass="font-normal flex flex-col gap-2 pr-6 py-4">
					{#if data.student.comments}
						{#each data.student.comments.split(/\n/g).filter(Boolean) as para}
							<p>{para}</p>
						{/each}
					{/if}
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="px-0 py-6">
					<Button outline href={`${data.student.id}/update/`}>Update</Button>
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</div>

<div class="flex gap-8">
	{#each data.student.contracts_sorted as contract}
		<Card size="xs">
			<div class="text-sm bg-gray-200">
				<pre>{JSON.stringify(contract, null, 1)}</pre>
			</div>
			<div class="flex justify-center mt-4 space-x-3">
				<Button outline href={`/contract-update/${contract.id}`}>Update</Button>
				<Button color="light" class="dark:text-white" disabled>Delete</Button>
			</div>
		</Card>
	{/each}
</div>

<div class="form-width pt-8">
	<form method="post" action="?/createContract" use:enhance>
		<input class="hidden" type="number" name="student" bind:value={data.student.id} />
		<ContractForm {form} />
	</form>
</div>

<Hr />

<Button href={`/student/${data.student.id}/new-application`}>New application</Button>

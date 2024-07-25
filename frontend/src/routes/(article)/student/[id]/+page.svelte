<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, Button, Heading } from 'flowbite-svelte';

	import { formatLocation } from '$lib/api/student';
	import countryFlags from '$lib/constants/countryFlags';
	import { toLongDate } from '$lib/utils/dateUtils';

	export let data;

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

<Heading tag="h1" class="p-6 font-normal">{data.student.fullname}</Heading>

<div class="w-[36rem] p-6">
	<Table>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Preferred name</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{data.student.preferred_name}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Gender</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{formatGender(data.student.gender)}</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Citizenship</TableBodyCell>
				<TableBodyCell tdClass="font-normal">
					<div class="flex gap-2">
						<div>{countryFlags[data.student.citizenship]}</div>
						<div>{data.student.citizenship}</div>
					</div>
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Home</TableBodyCell>
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
				<TableBodyCell tdClass="w-48 font-medium px-6 py-4">Date of birth</TableBodyCell>
				<TableBodyCell tdClass="font-normal">{toLongDate(data.student.date_of_birth)}</TableBodyCell
				>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="align-top w-48 font-medium px-6 py-4">
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
				<TableBodyCell></TableBodyCell>
				<TableBodyCell>
					<div class="text-right">
						<Button outline href={`${data.student.id}/update/`}>Update</Button>
					</div>
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</div>

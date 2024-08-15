<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import type { StudentDetail } from '$lib/api/student';
	import countryFlags from '$lib/constants/countryFlags';
	import { formatLocation } from '$lib/api/student';
	import { toLongDate } from '$lib/utils/dateUtils';
	import Comments from '$lib/components/typography/Comments.svelte';

	export let student: StudentDetail;

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

	const placeHolder = '-';
</script>

<Table>
	<TableBody>
		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Preferred name</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				{student.preferred_name || placeHolder}
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Gender</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{formatGender(student.gender)}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Citizenship</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				<div class="flex gap-2">
					<div>{countryFlags[student.citizenship]}</div>
					<div>{student.citizenship}</div>
				</div>
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Home</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				{#if student.base_country}
					<div class="flex gap-2">
						<div>{countryFlags[student.base_country]}</div>
						<div>{formatLocation(student)}</div>
					</div>
				{:else}
					{placeHolder}
				{/if}
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Date of birth</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				{toLongDate(student.date_of_birth) || placeHolder}
			</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4 align-top">Comments</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				{#if student.comments}
					<Comments text={student.comments} divClass="pr-4" />
				{:else}
					{placeHolder}
				{/if}
			</TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>

<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import type { School } from '$lib/api/school';
	import countryFlags from '$lib/constants/countryFlags';

	export let school: School;
</script>

<Table>
	<TableBody>
		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Type</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{school.type}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 min-w-40 font-medium py-4 align-top">Full name</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{school.name}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Alt. name</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{school.alt_name}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Country</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				<div class="flex gap-2">
					<div>{countryFlags[school.country]}</div>
					<div>{school.country}</div>
				</div>
			</TableBodyCell>
		</TableBodyRow>
	</TableBody>
</Table>

<script lang="ts">
	import { Card, P, Heading, Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import type { Service } from '$lib/api/contract';
	import { toLongDate } from '$lib/utils/dateUtils';

	export let service: Service;
</script>

<Card class="w-[16rem]">
	<P size="sm" color="text-gray-400" class="font-semibold">{service.role}</P>
	<Heading tag="h3" class="text-2xl font-medium py-1">{service.cf_username}</Heading>

	<Table noborder divClass="mt-4">
		<TableBody>
			<TableBodyRow>
				<TableBodyCell tdClass="w-16 font-medium py-2">
					<span class="text-gray-400">Since</span>
				</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-2">
					{toLongDate(service.start_date) || 'N/A'}
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-16 font-medium py-2">
					<span class="text-gray-400">Until</span>
				</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-2">
					{toLongDate(service.end_date) || 'N/A'}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<slot />
</Card>

<script lang="ts">
	import { Card, P, Heading, Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import type { Service } from '$lib/api/contract';
	import { toLongDate } from '$lib/utils/dateUtils';
	import { isActive } from '$lib/utils/serviceUtils';

	export let service: Service;
	$: serviceIsActive = isActive(service);
</script>

<Card class={`w-[14rem]${serviceIsActive ? '' : ' bg-gray-50'}`}>
	<P size="sm" color="text-gray-500" class="font-semibold">{service.role}</P>

	<Heading tag="h3" class={`text-2xl font-medium py-1${serviceIsActive ? '' : ' text-gray-500'}`}>
		{service.cf_username}
	</Heading>

	<Table noborder divClass="mt-4">
		<TableBody>
			<TableBodyRow class="bg-inherit">
				<TableBodyCell tdClass="w-14 font-medium py-2">
					<span class="text-gray-500">Since</span>
				</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-2">
					{toLongDate(service.start_date) || '-'}
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow class="bg-inherit">
				<TableBodyCell tdClass="w-14 font-medium py-2">
					<span class="text-gray-500">Until</span>
				</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-2">
					{toLongDate(service.end_date) || '-'}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<slot />
</Card>

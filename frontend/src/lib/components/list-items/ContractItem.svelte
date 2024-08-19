<script lang="ts">
	import {
		Card,
		P,
		A,
		Heading,
		Indicator,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		type IndicatorColorType
	} from 'flowbite-svelte';

	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	import type { Contract } from '$lib/api/student';
	import { isPast, toShortDate } from '$lib/utils/dateUtils';
	import { orderByEndDateRole } from '$lib/utils/serviceUtils';

	export let contract: Contract;

	$: dateString =
		contract.date && contract.student_progression_when_signed
			? `${toShortDate(contract.date)} (${contract.student_progression_when_signed})`
			: toShortDate(contract.date) || contract.student_progression_when_signed;

	const setColor = (contractStatus: string): IndicatorColorType => {
		switch (contractStatus) {
			case 'In effect':
				return 'green';
			case 'Terminated':
				return 'red';
			case 'Fulfilled':
				return 'gray';
			default:
				return 'none';
		}
	};

	const clipRole = (role: string): string => {
		switch (role) {
			case '服务顾问':
				return '服务';
			case '战略顾问':
				return '战略';
			case '流程顾问':
				return '流程';
			default:
				return role;
		}
	};
</script>

<Card class="min-h-[300px] min-w-[224px] hover:bg-white flex flex-col justify-between">
	<div>
		<div class="flex gap-2 items-center">
			<Indicator color={setColor(contract.status)} />
			<P size="sm" color="text-gray-500" class="font-medium">{contract.status}</P>
		</div>

		<Heading tag="h3" class="font-bold text-xl tracking-wide mt-3 mb-1">
			{contract.type}
			{contract.target_year}
		</Heading>

		{#if dateString}
			<P size="sm" color="text-gray-500">{dateString}</P>
		{/if}

		{#if contract.services.length}
			<Table noborder divClass="mt-5 w-fit">
				<TableBody>
					{#each contract.services.sort(orderByEndDateRole) as service}
						<TableBodyRow class="bg-inherit">
							<TableBodyCell tdClass="w-fit font-medium py-2 pr-8">
								<span class="text-gray-500">{clipRole(service.role)}</span>
							</TableBodyCell>
							<TableBodyCell tdClass="font-normal py-2 pr-8">
								<span class={isPast(service.end_date) ? 'text-gray-500' : ''}>
									{service.cf_username}
								</span>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{:else}
			<A class="mt-5 text-sm" href={`/contract/${contract.id}`}>
				Add staff<ArrowRightOutline class="ms-1" />
			</A>
		{/if}
	</div>

	<div class="mt-8 flex gap-4">
		<slot />
		<A href={`/contract/${contract.id}`}>
			<ArrowRightOutline class="ms-1" />
		</A>
	</div>
</Card>

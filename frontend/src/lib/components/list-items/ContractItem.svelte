<script lang="ts">
	import {
		Card,
		P,
		Heading,
		Indicator,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Button,
		Dropdown,
		DropdownDivider,
		type IndicatorColorType
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	import type { Contract } from '$lib/api/student';
	import { toShortDate } from '$lib/utils/dateUtils';
	import DropdownActionItem from './DropdownActionItem.svelte';

	export let contract: Contract;
	export let actions: boolean;
	export let updateAction: () => void = () => {};
	export let updateServicesAction: () => void = () => {};
	export let deleteAction: () => void = () => {};

	let indicatorColor: IndicatorColorType;

	$: indicatorColor = contract.status === 'In effect' ? 'green' : 'gray';
	$: statusColor = `text-${indicatorColor}-400`;

	$: dateString =
		contract.date && contract.student_progression_when_signed
			? `${toShortDate(contract.date)} (${contract.student_progression_when_signed})`
			: toShortDate(contract.date) || contract.student_progression_when_signed;
</script>

<Card class="w-[16rem]">
	<div class="flex gap-2 items-center">
		<Indicator color={indicatorColor} />
		<P size="sm" color={statusColor}>{contract.status}</P>
	</div>

	<Heading tag="h3" class="font-bold text-xl mt-3 mb-1">
		{contract.type}
		{contract.target_year}
	</Heading>

	{#if dateString}
		<P size="sm" color="text-gray-400">{dateString}</P>
	{/if}

	{#if contract.services.length}
		<Table divClass="mt-5 w-fit">
			<TableBody>
				{#each contract.services as service}
					<TableBodyRow>
						<TableBodyCell tdClass="w-24 font-medium py-4">{service.role}</TableBodyCell>
						<TableBodyCell tdClass="font-normal py-4 pr-8">{service.cf_username}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}

	{#if actions}
		<Button outline class="mt-8 w-fit">Actions<ChevronDownOutline class="w-6 h-6 ms-1" /></Button>
		<Dropdown class="w-40 z-20" placement="bottom-start">
			<DropdownActionItem text="Update contract" onClick={updateAction} />
			<DropdownActionItem text="Update CF team" onClick={updateServicesAction} />
			<DropdownDivider />
			<DropdownActionItem text="Delete contract" onClick={deleteAction} dark />
		</Dropdown>
	{/if}
</Card>

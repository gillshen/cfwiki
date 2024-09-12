<script lang="ts">
	import { type IndicatorColorType, Card, P, Heading, Indicator } from 'flowbite-svelte';

	import type { Contract } from '$lib/api/student';
	import { toShortDate } from '$lib/utils/dateUtils';
	import { isActive, orderByEndDateRole } from '$lib/utils/serviceUtils';

	export let contract: Contract;

	let dateString: string;

	$: {
		if (contract.date && contract.student_progression_when_signed) {
			dateString = `${toShortDate(contract.date)} (${contract.student_progression_when_signed})`;
		} else {
			dateString = toShortDate(contract.date) || contract.student_progression_when_signed;
		}
	}

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

<Card class="hover:bg-white !px-8">
	<div class="flex items-baseline gap-6">
		<Heading tag="h3" class="text-gray-800 font-bold text-xl w-fit section-title">
			{contract.type}
			{contract.target_year}
		</Heading>

		<div class="flex gap-1 items-center">
			<Indicator color={setColor(contract.status)} class="size-3" />
			<P size="sm" color="text-gray-500" class="font-normal section-title">{contract.status}</P>
		</div>
	</div>

	{#if dateString}
		<P size="sm" color="text-gray-500" class="mt-2">{dateString}</P>
	{/if}

	<div class="text-sm mt-6 flex flex-col gap-2">
		{#each contract.services.sort(orderByEndDateRole) as service}
			<div class="flex gap-4">
				<div class="font-medium">{clipRole(service.role)}</div>
				<div class={isActive(service) ? 'text-gray-900' : 'text-gray-400'}>
					{service.cf_username}
				</div>
			</div>
		{/each}
	</div>

	<slot />
</Card>

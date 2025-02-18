<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';
	import Ban from 'lucide-svelte/icons/ban';
	import CalendarDays from 'lucide-svelte/icons/calendar-days';

	import type { Contract } from '$lib/api/student';
	import { orderByEndDateRole } from '$lib/util/serviceUtils';

	export let contract: Contract;
	export let canEdit: boolean;
</script>

<HoverCard.Root>
	<HoverCard.Trigger class="text-stone-700 w-fit hover:no-underline">
		<Card.Root class="w-48 hover:bg-gray-100">
			<Card.Header class="px-4 py-4">
				<Card.Title class="text-base">{contract.type} {contract.target_year}</Card.Title>
				<Card.Description class="text-sm flex gap-1.5 items-center">
					{#if contract.status === 'Fulfilled'}
						<CircleCheckBig class="w-4 h-4" />
					{:else if contract.status === 'In effect'}
						<CalendarClock class="w-4 h-4" />
					{:else}
						<Ban class="w-4 h-4" />
					{/if}
					{contract.status}</Card.Description
				>
			</Card.Header>
		</Card.Root>
	</HoverCard.Trigger>
	<HoverCard.Content class="w-fit flex text-sm flex flex-col gap-2 px-6">
		<div class="flex gap-1 items-center text-stone-600 text-xs">
			<CalendarDays class="w-4 h-4" />
			{#if contract.date}
				Signed {contract.date}
			{:else}
				Date unknown
			{/if}
			{#if contract.date && contract.student_progression_when_signed}
				<div>&bullet;</div>
			{/if}
			{#if contract.student_progression_when_signed}
				<div>{contract.student_progression_when_signed}</div>
			{/if}
		</div>
		<div class="flex flex-col gap-2 mt-2 text-sm">
			{#each contract.services.sort(orderByEndDateRole) as service}
				<div class="flex gap-2">
					<div class="font-medium">{service.role}</div>
					<a href={`/cf/${service.cf_username}`}>{service.cf_username}</a>
				</div>
			{/each}
		</div>
		{#if canEdit}
			<div class="mt-4">
				<Button variant="link" size="sm" class="px-0">
					<Pencil class="mr-1 h-3 w-3" />Edit
				</Button>
			</div>
		{/if}
	</HoverCard.Content>
</HoverCard.Root>

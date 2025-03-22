<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import { Button } from '$lib/components/ui/button/index';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';
	import Ban from 'lucide-svelte/icons/ban';

	import type { Contract } from '$lib/api/student';
	import { orderByEndDateRole } from '$lib/util/serviceUtils';

	export let contract: Contract;
</script>

<Card.Root>
	<Card.Header class="py-4">
		<Card.Title class="flex w-full justify-between items-center">
			<div class="text-base font-bold">{contract.type} {contract.target_year}</div>
			<Button href={`/contract/${contract.id}`} variant="ghost" size="icon" class="rounded-full">
				<ChevronRight class="h-4 w-4" />
			</Button>
		</Card.Title>
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
	<Card.Content class="max-w-[260px] min-w-[260px] pl-5 pt-2">
		<div class="flex flex-wrap gap-4 text-sm pr-4">
			{#each contract.services.sort(orderByEndDateRole) as service}
				<div class="flex gap-2 items-center">
					<Avatar.Root>
						<Avatar.Fallback>{service.cf_username.charAt(0)}</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex flex-col">
						<div class="font-medium">{service.cf_username}</div>
						<div class="text-xs text-zinc-400">{service.role}</div>
					</div>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>

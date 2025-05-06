<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import CalendarClock from 'lucide-svelte/icons/calendar-clock';
	import CalendarCheck from 'lucide-svelte/icons/calendar-check';

	import type { Contract } from '$lib/api/student';
	import type { ContractStatus } from '$lib/api/contract';
	import ContractStatusSign from '$lib/components/misc/ContractStatusSign.svelte';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import { toShortYearMonth } from '$lib/util/dateUtils';

	import {
		groupByCfPerson,
		endedEarly,
		orderByRoleUsername,
		formatDates
	} from '$lib/util/serviceUtils';

	export let contract: Contract;
	export let canEdit: boolean;

	const styleMap: Record<
		ContractStatus,
		{ text: string; bg: string; border: string; shadow: string }
	> = {
		'In effect': {
			text: 'text-primary-foreground',
			bg: 'bg-primary',
			border: 'border-muted-foreground',
			shadow: 'shadow-muted-foreground/30'
		},
		Fulfilled: {
			text: '',
			bg: 'bg-muted',
			border: '',
			shadow: ''
		},
		Terminated: {
			text: '',
			bg: 'bg-rose-300',
			border: 'border-rose-300',
			shadow: 'shadow-rose-300/30'
		}
	};
</script>

<Card.Root
	class={cn(
		'min-w-[248px] min-h-[248px] relative mt-4 shadow-sm',
		styleMap[contract.status].border,
		styleMap[contract.status].shadow
	)}
>
	<div
		class={cn(
			'absolute -top-4 -left-1 h-8 rounded-sm pl-3 pr-4 flex items-center',
			styleMap[contract.status].bg,
			styleMap[contract.status].border
		)}
	>
		<ContractStatusSign status={contract.status} class={styleMap[contract.status].text} />
	</div>
	<Card.Header class="pb-2 pt-8">
		<Card.Title class="text-lg font-semibold">
			<div>{contract.type} {contract.target_year}</div>
		</Card.Title>
		<Card.Description class="pb-2 flex items-center gap-1 text-xs">
			<!-- <PenTool class="size-3 -rotate-90" /> -->
			{#if !contract.date && !contract.student_progression_when_signed}
				Date of Signing: ?
			{/if}
			{#if contract.student_progression_when_signed}
				<div>{contract.student_progression_when_signed}</div>
			{/if}

			{#if contract.date && contract.student_progression_when_signed}
				<div>&bullet;</div>
			{/if}
			{#if contract.date}
				<div>{toShortYearMonth(contract.date)}</div>
			{/if}
		</Card.Description>
	</Card.Header>

	<Card.Content
		class={cn('pt-2 flex flex-col gap-4 text-sm min-w-[250px]', canEdit ? 'pb-0' : 'pb-8')}
	>
		{#each Object.entries(groupByCfPerson(contract.services.sort(orderByRoleUsername))) as [cfUsername, services]}
			{@const stayedTillEnd = services.map((s) => !endedEarly(s)).some(Boolean)}
			<div class="flex items-center gap-2">
				<UserAvatar username={cfUsername} imageClass="size-[26px]" />
				<div class="flex flex-col">
					<div
						class={stayedTillEnd
							? 'font-medium text-primary'
							: 'font-medium text-muted-foreground/70'}
					>
						{cfUsername}
					</div>
					<div class="text-xs flex text-muted-foreground">
						{#each services as service, index}
							{@const { startDate, endDate } = formatDates({ service, contract })}
							{#if index}
								<div class="mx-1 text-muted-foreground">&bullet;</div>
							{/if}
							<HoverCard.Root>
								<HoverCard.Trigger
									class="cursor-pointer underline decoration-dotted hover:decoration-dotted"
								>
									<div class={endedEarly(service) ? 'text-muted-foreground/70' : ''}>
										{service.role}
									</div>
								</HoverCard.Trigger>
								<HoverCard.Content
									class="text-sm bg-primary/80 text-primary-foreground backdrop-blur rounded-xl border-none shadow-md flex flex-col gap-4 p-6 pb-8"
								>
									<h3 class="text-base font-semibold flex flex-col gap-1 mb-2">
										<UserAvatar username={service.cf_username} class="invert bg-transparent" />
										<div>{service.cf_username} &bullet; {service.role}</div>
									</h3>
									<div class="flex items-center gap-4">
										<CalendarClock class="size-5" />
										<div>
											<h4 class="font-semibold">Start Date</h4>
											<p class="font-normal text-primary-foreground/70">{startDate}</p>
										</div>
									</div>
									<div class="flex items-center gap-4">
										<CalendarCheck class="size-5" />
										<div>
											<h4 class="font-semibold">End Date</h4>
											<p class="font-normal text-primary-foreground/70">{endDate}</p>
										</div>
									</div>
								</HoverCard.Content>
							</HoverCard.Root>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</Card.Content>

	{#if canEdit}
		<Card.Footer class="pt-0 pb-2">
			<Button
				size="icon"
				variant="ghost"
				class="text-primary p-0 ml-auto cursor-pointer rounded-full"
				href="/student/{contract.student}/contract/{contract.id}"
			>
				<MoveRight class="size-4" />
			</Button>
		</Card.Footer>
	{/if}
</Card.Root>

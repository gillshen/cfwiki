<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import FilePan from 'lucide-svelte/icons/file-pen';
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import Clock from 'lucide-svelte/icons/clock';
	import Ban from 'lucide-svelte/icons/ban';
	import Pencil from 'lucide-svelte/icons/pencil-line';

	import type { Contract } from '$lib/api/student';
	import { groupByCfPerson, leftEarly, orderByRole } from '$lib/util/serviceUtils';
	import { toISOYearMonth } from '$lib/util/dateUtils';

	export let contract: Contract;
	export let canEdit: boolean = false;
</script>

<Card.Root>
	<Card.Header class="py-4">
		<Card.Title
			class="text-base font-semibold tracking-normal pb-2 flex items-center gap-4 space-between"
		>
			<div>{contract.type} {contract.target_year}</div>
			{#if canEdit}
				<Button
					variant="link"
					size="icon"
					class="font-normal text-muted-foreground hover:no-underline hover:text-secondary-foreground/80"
				>
					<Pencil class="mr-1 size-4" />
				</Button>
			{/if}</Card.Title
		>
		<Card.Description class="flex gap-4 items-center">
			<div class="text-sm flex gap-1 items-center">
				{#if contract.status === 'Fulfilled'}
					<CircleCheckBig class="size-4" />
				{:else if contract.status === 'In effect'}
					<Clock class="size-4" />
				{:else}
					<Ban class="size-4" />
				{/if}
				{contract.status === 'In effect' ? 'In Effect' : contract.status}
			</div>
		</Card.Description>
	</Card.Header>

	<Card.Content class="min-w-[240px] pt-2 flex flex-col gap-4 text-sm">
		{#each Object.entries(groupByCfPerson(contract.services.sort(orderByRole))) as [cfUsername, services]}
			{@const stayedTillEnd = services.map((s) => !leftEarly(s)).some(Boolean)}
			<div class="flex items-center gap-4 min-w-[240px] bg-muted px-4 py-2 rounded-lg">
				<HoverCard.Root>
					<HoverCard.Trigger class="flex-grow-1 w-full hover:no-underline">
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
									{#if index}
										<div class="mx-1 text-muted-foreground">&bullet;</div>
									{/if}
									<div class={leftEarly(service) ? 'text-muted-foreground/70' : ''}>
										{service.role}
									</div>
								{/each}
							</div>
						</div>
					</HoverCard.Trigger>
					<HoverCard.Content>
						<pre class="text-sm max-h-[50vh] overflow-auto">{JSON.stringify(
								services,
								null,
								2
							)}</pre>
					</HoverCard.Content>
				</HoverCard.Root>

				{#if canEdit}
					<Button
						variant="link"
						class="px-0 font-normal text-muted-foreground hover:no-underline hover:text-secondary-foreground/80"
					>
						<Pencil class="size-4" />
					</Button>
				{/if}
			</div>
		{/each}
	</Card.Content>

	{#if contract.date || contract.student_progression_when_signed}
		<Card.Footer class="pb-5 flex items-center gap-1 text-muted-foreground text-xs">
			<FilePan class="size-[14px] -translate-y-[1px]" />
			{#if contract.date}
				<div>{toISOYearMonth(contract.date)}</div>
			{/if}
			{#if contract.date && contract.student_progression_when_signed}
				<div>&bullet;</div>
			{/if}
			{#if contract.student_progression_when_signed}
				<div>{contract.student_progression_when_signed}</div>
			{/if}
		</Card.Footer>
	{/if}
</Card.Root>

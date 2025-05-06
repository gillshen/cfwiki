<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import Signature from 'lucide-svelte/icons/signature';

	import type { Contract } from '$lib/api/student';
	import type { ContractStatus } from '$lib/api/contract';
	import ContractStatusSign from '$lib/components/misc/ContractStatusSign.svelte';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import PencilEditButton from '$lib/components/misc/PencilEditButton.svelte';
	import { groupByCfPerson, endedEarly, orderByRoleUsername } from '$lib/util/serviceUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';

	export let contract: Contract;
	export let canEdit: boolean;

	const colorMap: Record<ContractStatus, { bg: string; border: string; shadow: string }> = {
		'In effect': { bg: 'bg-mint-300', border: 'border-mint-300', shadow: 'shadow-mint-100' },
		Fulfilled: { bg: 'bg-muted', border: '', shadow: '' },
		Terminated: { bg: 'bg-rose-300', border: 'border-rose-300', shadow: 'shadow-rose-100' }
	};
</script>

<Card.Root
	class={cn(
		'min-w-[250px] min-h-[250px] relative mt-4 shadow-sm',
		colorMap[contract.status].border,
		colorMap[contract.status].shadow
	)}
>
	<div
		class={cn(
			'absolute -top-4 -left-1 h-8 border rounded-sm pl-3 pr-4 flex items-center',
			colorMap[contract.status].bg,
			colorMap[contract.status].border
		)}
	>
		<ContractStatusSign status={contract.status} />
	</div>
	<Card.Header class="pb-2 pt-8">
		<Card.Title class="text-lg font-semibold pb-2 flex items-center gap-2">
			<div>{contract.type} {contract.target_year}</div>
			{#if canEdit}
				<PencilEditButton
					text=""
					href="/student/{contract.student}/contract/{contract.id}"
					class="h-6"
					iconClass="translate-y-[1px]"
				/>
			{/if}
		</Card.Title>
	</Card.Header>

	<Card.Content class="pt-2 pb-8 flex flex-col gap-4 text-sm min-w-[250px]">
		{#each Object.entries(groupByCfPerson(contract.services.sort(orderByRoleUsername))) as [cfUsername, services]}
			{@const stayedTillEnd = services.map((s) => !endedEarly(s)).some(Boolean)}
			<div class="flex items-center gap-4">
				<HoverCard.Root>
					<HoverCard.Trigger
						class="flex items-center gap-2 flex-grow-1 w-full hover:no-underline group cursor-default"
					>
						<UserAvatar username={cfUsername} class="group-hover:bg-primary/10" />
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
									<div class={endedEarly(service) ? 'text-muted-foreground/70' : ''}>
										{service.role}
									</div>
								{/each}
							</div>
						</div>
					</HoverCard.Trigger>
					<HoverCard.Content>
						<pre class="text-sm bg-muted max-h-[50vh] overflow-auto">{JSON.stringify(
								services,
								null,
								2
							)}</pre>
					</HoverCard.Content>
				</HoverCard.Root>
			</div>
		{/each}
	</Card.Content>

	{#if contract.date || contract.student_progression_when_signed}
		<Card.Footer class="pb-5 flex items-center gap-1 text-muted-foreground text-xs justify-center">
			<Signature class="size-3" />
			{#if contract.student_progression_when_signed}
				<div>{contract.student_progression_when_signed}</div>
			{/if}

			{#if contract.date && contract.student_progression_when_signed}
				<div>&bullet;</div>
			{/if}
			{#if contract.date}
				<div>{toShortYearMonth(contract.date)}</div>
			{/if}
		</Card.Footer>
	{/if}
</Card.Root>

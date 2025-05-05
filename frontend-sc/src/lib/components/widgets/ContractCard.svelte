<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import Chevron from 'lucide-svelte/icons/chevron-right';
	import Signature from 'lucide-svelte/icons/signature';

	import type { Contract } from '$lib/api/student';
	import ContractStatusSign from '$lib/components/misc/ContractStatusSign.svelte';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import PencilEditButton from '$lib/components/misc/PencilEditButton.svelte';
	import { groupByCfPerson, leftEarly, orderByRoleUsername } from '$lib/util/serviceUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';

	export let contract: Contract;
	export let canEdit: boolean;
</script>

<Card.Root class="shadow-none min-w-[270px]">
	<Card.Header class="py-4">
		<Card.Title
			class="text-base font-semibold tracking-normal pb-2 flex items-center gap-4 w-full justify-between pr-2"
		>
			<div>{contract.type} {contract.target_year}</div>
			{#if canEdit}
				<PencilEditButton
					text=""
					href="/student/{contract.student}/contract/{contract.id}"
					class="h-6 pr-0"
					iconClass="translate-y-[1px]"
				/>
			{/if}
		</Card.Title>
		<Card.Description class="flex gap-4 items-center">
			<ContractStatusSign status={contract.status} />
		</Card.Description>
	</Card.Header>

	<Card.Content class="pt-2 pb-8 flex flex-col gap-4 text-sm">
		{#each Object.entries(groupByCfPerson(contract.services.sort(orderByRoleUsername))) as [cfUsername, services]}
			{@const stayedTillEnd = services.map((s) => !leftEarly(s)).some(Boolean)}
			<div class="flex items-center gap-4 min-w-[220px] rounded-lg">
				<div class="flex items-center gap-2 flex-grow-1 w-full hover:no-underline">
					<UserAvatar username={cfUsername} />
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
				</div>

				<HoverCard.Root>
					<HoverCard.Trigger>
						<Button variant="ghost" class="hover:bg-inherit" size="icon">
							<Chevron class="size-4" />
						</Button>
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

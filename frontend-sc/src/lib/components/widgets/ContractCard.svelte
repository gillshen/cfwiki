<script lang="ts">
	import { page } from '$app/stores';

	import * as Card from '$lib/components/ui/card/index';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from 'lucide-svelte/icons/pencil-line';
	import Chevron from 'lucide-svelte/icons/chevron-right';

	import type { CfUserListItem } from '$lib/api/user';
	import type { Contract } from '$lib/api/student';
	import ContractStatusSign from '$lib/components/misc/ContractStatusSign.svelte';
	import { groupByCfPerson, leftEarly, orderByRole } from '$lib/util/serviceUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';

	export let contract: Contract;
	export let canEdit: boolean = true;

	const cfUsers = $page.data.cfUsers as CfUserListItem[];

	const findAvatar = (username: string): string | undefined =>
		cfUsers.find((user) => user.username === username)?.avatar;
</script>

<Card.Root>
	<Card.Header class="py-4">
		<Card.Title
			class="text-base font-semibold tracking-normal pb-2 flex items-center gap-4 w-full justify-between pr-2"
		>
			<div>{contract.type} {contract.target_year}</div>
			{#if canEdit}
				<Button
					variant="link"
					href={`/contract/${contract.id}`}
					size="icon"
					class="font-normal text-muted-foreground hover:no-underline hover:text-secondary-foreground/80 size-6"
				>
					<Pencil class="size-4 translate-y-[1px]" />
				</Button>
			{/if}
		</Card.Title>
		<Card.Description class="flex gap-4 items-center">
			<ContractStatusSign status={contract.status} />
		</Card.Description>
	</Card.Header>

	<Card.Content class="pt-2 pb-8 flex flex-col gap-4 text-sm">
		{#each Object.entries(groupByCfPerson(contract.services.sort(orderByRole))) as [cfUsername, services]}
			{@const stayedTillEnd = services.map((s) => !leftEarly(s)).some(Boolean)}
			<div class="flex items-center gap-4 min-w-[220px] rounded-lg">
				<div class="flex items-center gap-2 flex-grow-1 w-full hover:no-underline">
					<Avatar.Root class="-translate-x-1 flex bg-primary/5">
						<Avatar.Image
							src={findAvatar(cfUsername)}
							class="size-7 m-auto"
							alt={`${cfUsername}-avatar`}
						/>
						<Avatar.Fallback>{cfUsername[0].toUpperCase()}</Avatar.Fallback>
					</Avatar.Root>
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

				<Popover.Root>
					<Popover.Trigger>
						<Button variant="ghost" class="hover:bg-inherit" size="icon">
							<Chevron class="size-4" />
						</Button>
					</Popover.Trigger>
					<Popover.Content>
						<pre class="text-sm bg-muted max-h-[50vh] overflow-auto">{JSON.stringify(
								services,
								null,
								2
							)}</pre>
					</Popover.Content>
				</Popover.Root>
			</div>
		{/each}
	</Card.Content>

	{#if contract.date || contract.student_progression_when_signed}
		<Card.Footer class="pb-5 flex items-center gap-1 text-muted-foreground text-xs">
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

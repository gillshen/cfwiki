<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Accordion from '$lib/components/ui/accordion/';
	import Button from '$lib/components/ui/button/button.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import Calendar from 'lucide-svelte/icons/calendar';

	import type { Contract } from '$lib/api/student';
	import type { ContractStatus, Service } from '$lib/api/contract';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import { endedEarly, orderByRoleUsername } from '$lib/util/serviceUtils';
	import { toShortDate, toShortYearMonth } from '$lib/util/dateUtils';

	export let contract: Contract;
	export let editable: boolean = false;
	export let editMode: boolean = false;
	export let href: string = '';

	const styleMap: Record<ContractStatus, string> = {
		'In effect': 'bg-sky-300',
		Fulfilled: 'bg-muted-foreground/70',
		Terminated: 'bg-red-400'
	};

	$: contractTitle = `${contract.type} ${contract.target_year}`;
	$: servicesSorted = contract.services.sort(orderByRoleUsername);

	$: servicesGrouped = Object.groupBy(servicesSorted, (s) => s.cf_username) as Record<
		string,
		Service[]
	>;
</script>

<div class="flex flex-col gap-1 my-2">
	{#if !editMode}
		<div class="flex items-center justify-between h-6 px-4">
			<h3 class="font-medium py-0">{contractTitle}</h3>
			<div class="flex items-center gap-1.5 text-xs">
				<div class={cn('size-3 shrink-0 rounded-full', styleMap[contract.status])}></div>
				<p class={contract.status === 'In effect' ? '' : 'text-muted-foreground'}>
					{contract.status}
				</p>
			</div>
		</div>
	{:else if editable}
		<div class="flex items-center justify-between">
			<Button variant="link" {href} class="h-6"
				>{contractTitle}<MoveRight class="size-4 ml-2" /></Button
			>
		</div>
	{:else}
		<div class="flex items-center justify-between">
			<Button
				variant="link"
				href=""
				class="h-6 text-muted-foreground hover:no-underline hover:cursor-not-allowed"
				>{contractTitle}</Button
			>
		</div>
	{/if}

	<Accordion.Root>
		<Accordion.Item value="contract-{contract.id}" class="border-none">
			<Accordion.Trigger
				class="font-normal px-4 inline-flex items-center py-0 text-muted-foreground hover:text-primary"
			>
				<div class="w-fit">
					{#each Object.entries(servicesGrouped) as [username, services], index}
						{@const stayedTillEnd = services.map((s) => !endedEarly(s)).some(Boolean)}
						<span class="inline-flex items-center gap-1">
							{#if index},
							{/if}<span class={stayedTillEnd ? '' : 'line-through'}>{username}</span>
						</span>
					{/each}
				</div>
			</Accordion.Trigger>
			<Accordion.Content class="px-4 pt-4 text-muted-foreground">
				<!-- date -->
				<div class="flex items-center">
					<Calendar class="size-3.5 mr-2" />
					{#if contract.date && contract.student_progression_when_signed}
						<p>
							{toShortYearMonth(contract.date)} / {contract.student_progression_when_signed}
						</p>
					{:else if contract.date}
						<p>{toShortYearMonth(contract.date)}</p>
					{:else if contract.student_progression_when_signed}
						<p>{contract.student_progression_when_signed}</p>
					{:else}
						<p>Date n/a</p>
					{/if}
				</div>

				<!-- staff -->
				<div class="flex flex-col gap-4 pt-4">
					{#each Object.entries(servicesGrouped) as [username, services]}
						<div class="flex items-start gap-2">
							<UserAvatar {username} class="size-[32px]" imageClass="size-[20px]" />

							<div>
								<a href="/cf/{username}" class="text-primary">{username}</a>

								{#if services.some((s) => s.start_date || s.end_date)}
									<!-- use the full layout if some services have start/end dates -->
									<ul class="flex flex-col text-xs">
										{#each services as service}
											{@const startDate = toShortDate(service.start_date)}
											{@const endDate = toShortDate(service.end_date)}
											<li class="inline-flex gap-1.5">
												<span>{service.role}</span>
												{#if startDate && endDate}
													<span>&bull;</span>
													<span>{startDate} - {endDate}</span>
												{:else if startDate}
													<span>&bull;</span>
													<span>Starting {startDate}</span>
												{:else if endDate}
													<span>&bull;</span>
													<span>Ended {endDate}</span>
												{/if}
											</li>
										{/each}
									</ul>
								{:else}
									<!-- use a compact layout otherwise -->
									<ul class="flex items-center gap-1 text-muted-foreground text-xs">
										{#each services as service, index}
											{#if index}&bull;{/if}
											<li>{service.role}</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

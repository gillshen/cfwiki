<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Accordion from '$lib/components/ui/accordion/';
	import Button from '$lib/components/ui/button/button.svelte';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import CalendarDays from 'lucide-svelte/icons/calendar-days';

	import type { Contract } from '$lib/api/student';
	import type { ContractStatus, Service } from '$lib/api/contract';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import ContractSubhead from './ContractSubhead.svelte';
	import { orderByRoleUsername } from '$lib/util/serviceUtils';
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
			<div class="flex items-center gap-2">
				<div class={cn('size-3 shrink-0 rounded-full', styleMap[contract.status])}></div>
				<p class={contract.status === 'In effect' ? '' : 'text-muted-foreground'}>
					{contract.status}
				</p>
			</div>
		</div>

		<Accordion.Root>
			<Accordion.Item value="contract-{contract.id}" class="border-none">
				<Accordion.Trigger
					class="font-normal py-0 pr-4 text-muted-foreground hover:no-underline hover:text-primary"
				>
					<ContractSubhead {servicesGrouped} />
				</Accordion.Trigger>
				<Accordion.Content class="px-4 py-3 text-muted-foreground">
					<div class="flex flex-col gap-4">
						<!-- date -->
						{#if contract.date || contract.student_progression_when_signed}
							<div class="flex items-center">
								<CalendarDays class="size-3.5 mr-1.5" />
								<p>
									{[toShortYearMonth(contract.date), contract.student_progression_when_signed]
										.filter(Boolean)
										.join(' / ')}
								</p>
							</div>
						{/if}

						<!-- staff -->
						<div class="flex flex-col gap-4 px-6 mt-2">
							{#each Object.entries(servicesGrouped) as [username, services]}
								<a
									class="flex items-center gap-2 group w-fit hover:no-underline"
									href="/cf/{username}"
								>
									<UserAvatar {username} class="size-[32px]" imageClass="size-[20px]" />

									<div class="flex flex-col gap-1">
										<p class="text-primary group-hover:underline">{username}</p>

										<ul class="flex items-center gap-1.5 text-xs">
											{#each services as service, index}
												{#if index}&bull;{/if}
												<li class="inline-flex gap-1">
													<span>{service.role}</span>
													{#if service.start_date && service.end_date}
														<span>{toShortDate(service.start_date, service.end_date)}</span>
													{:else if service.start_date}
														<span>starting {toShortDate(service.start_date)}</span>
													{:else if service.end_date}
														<span>until {toShortDate(service.end_date)}</span>
													{/if}
												</li>
											{/each}
										</ul>
									</div>
								</a>
							{/each}
						</div>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	{:else}
		{#if editable}
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
		<ContractSubhead {servicesGrouped} class="text-xs text-muted-foreground" />
	{/if}
</div>

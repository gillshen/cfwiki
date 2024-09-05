<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { CalendarMonthOutline } from 'flowbite-svelte-icons';

	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import ApplicationRoundPopover from '$lib/components/program-page/ApplicationRoundPopover.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { groupByYearTerm } from '$lib/utils/applicationRoundUtils';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let applRounds: ApplicationRoundListItem[];
	export let deleteForm: SuperValidated<any>;

	let activeRound: ApplicationRoundListItem | null = null;
	let deleteModal = false;
</script>

<article class="flex flex-col gap-6">
	{#each Object.entries(groupByYearTerm(applRounds)) as [key, rounds]}
		<div>
			<div class="text-sm font-medium mb-2">{key}</div>

			<div class="grid grid-cols-3 gap-4">
				{#each rounds as applRound}
					<div class="min-w-32 rounded-lg flex items-center bg-stone-50 px-2 py-3">
						<CalendarMonthOutline size="xl" class="me-2 text-gray-500" />

						<div>
							<div class="text-sm font-medium text-primary-600 hover:underline cursor-pointer">
								{applRound.name}
							</div>
							<ApplicationRoundPopover
								{applRound}
								onDelete={() => {
									activeRound = applRound;
									deleteModal = true;
								}}
							/>

							{#if applRound.due_date}
								<div class="text-sm truncate">{toShortDate(applRound.due_date)}</div>
							{:else}
								<div class="text-sm text-gray-400">Date N/A</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</article>

<FormModal
	open={deleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	entity={activeRound}
	action={'?/deleteApplicationRound'}
	title="Delete admission plan"
	on:close={() => (deleteModal = false)}
>
	<DeleteMessage slot="preface" name={`this admission plan (${activeRound?.name})`} />
</FormModal>

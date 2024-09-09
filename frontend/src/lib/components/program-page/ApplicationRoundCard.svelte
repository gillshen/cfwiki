<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { CalendarMonthOutline } from 'flowbite-svelte-icons';
	import { isPast } from 'date-fns';

	import type { ApplicationRoundListItem } from '$lib/api/applicationRound';
	import ApplicationRoundPopover from '$lib/components/program-page/ApplicationRoundPopover.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let applRound: ApplicationRoundListItem;
	export let deleteForm: SuperValidated<any>;

	let deleteModal = false;

	let containerClass: string;
	let iconClass: string;
	let nameDivClass: string;
	let dateDivClass: string;

	$: if (!!applRound.due_date && isPast(applRound.due_date)) {
		containerClass = 'bg-stone-100';
		iconClass = 'text-gray-400';
		nameDivClass = 'text-gray-400';
		dateDivClass = 'text-gray-400';
	} else {
		containerClass = 'bg-stone-50 shadow-md';
		iconClass = 'text-gray-700';
		nameDivClass = 'text-primary-700';
		dateDivClass = 'text-gray-700';
	}
</script>

<div class={`min-w-32 rounded-lg flex items-center px-2 py-3 ${containerClass}`}>
	<CalendarMonthOutline size="xl" class={`me-2 ${iconClass}`} />

	<div class="text-sm cursor-pointer">
		<div class={`font-medium ${nameDivClass}`}>{applRound.name}</div>

		{#if applRound.due_date}
			<div class={`text-sm truncate ${dateDivClass}`}>
				{toShortDate(applRound.due_date)}
			</div>
		{:else}
			<div class="text-sm text-gray-400">Date N/A</div>
		{/if}
	</div>

	<ApplicationRoundPopover {applRound} onDelete={() => (deleteModal = true)} />
</div>

<FormModal
	open={deleteModal}
	superform={deleteForm}
	fields={DeleteForm}
	entity={applRound}
	action={'?/deleteApplicationRound'}
	title="Delete admission plan"
	on:close={() => (deleteModal = false)}
>
	<DeleteMessage slot="preface" name={`this admission plan (${applRound.name})`} />
</FormModal>

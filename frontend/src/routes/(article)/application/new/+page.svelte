<script lang="ts">
	import { writable } from 'svelte/store';
	import { Heading, Hr, Input, Alert, Button, A } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms';

	import type { StagedApplication } from '$lib/schemas/application';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import ApplicationStagingForm from '$lib/components/application-prep-form/ApplicationStagingForm.svelte';
	import StagedApplicationCard from '$lib/components/application-prep-form/StagedApplicationCard.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';

	export let data;

	const contract = writable<number>(data.contract.id);
	const staged = writable<StagedApplication[]>([]);
	const schoolId = writable<number | ''>();
	const programId = writable<number | ''>();

	let showToast = false;
	let toastMessage = '';

	const { form, enhance } = superForm(data.batchNewApplicationForm, {
		dataType: 'json',
		onUpdated({ form }) {
			if (!form.valid) {
				toastMessage = form.message;
				showToast = true;
			}
		}
	});

	$: nAppls = $form.rounds.length;

	let programTypes: string | string[];

	switch (data.programType) {
		case 'freshman':
			programTypes = 'UG Freshman';
			break;
		case 'transfer':
			programTypes = 'UG Transfer';
			break;
		case 'graduate':
			programTypes = ["Master's", 'Doctorate'];
			break;
		case 'nondegree':
			programTypes = 'Non-degree';
	}

	const removeStaged = (i: number) => {
		staged.update((items) => items.slice(0, i).concat(items.slice(i + 1)));
	};
</script>

<Heading tag="h3" class="page-title">Create applications for {data.term} {data.year}</Heading>

<Hr />

<div class="grid grid-cols-2 gap-4">
	<div>
		<Alert color="blue" class="form-width flex gap-2">
			<InfoCircleOutline />
			<span>
				Use the form below to select programs. The ones you&rsquo;ve selected will appear on the
				right. When done, click <strong>Create</strong>.
			</span>
		</Alert>

		{#await Promise.all([data.schools, data.programs, data.applicationRounds])}
			<FetchingDataSign divClass="mt-6" text="Preparing your form..." />
		{:then [schools, programs, applRounds]}
			<ApplicationStagingForm
				{form}
				{contract}
				{staged}
				{schoolId}
				{programId}
				{schools}
				{programs}
				{applRounds}
				{programTypes}
				year={data.year}
				term={data.term}
				newProgramForm={data.newProgramForm}
				newApplicationRoundForm={data.newApplicationRoundForm}
			/>
		{/await}
	</div>

	<div class="h-fit min-h-[10rem] flex flex-col px-8 py-6 rounded-lg bg-stone-50">
		<Heading tag="h2" class="text-2xl font-bold flex mb-8">Applying to ...</Heading>

		<form class="form-width" method="post" action="?/createApplications" use:enhance>
			<Input type="number" name="contract" value={$form.contract} class="hidden" />

			<div class="flex flex-col gap-4">
				{#each $form.rounds as _, i}
					<Input type="number" name="round" bind:value={$form.rounds[i]} class="hidden" />
					<StagedApplicationCard item={$staged[i]} onRemove={() => removeStaged(i)} />
				{/each}
			</div>

			{#if !nAppls}
				<NoDataSign text="You have not added any programs." />
			{/if}
			<Button type="submit" class="w-fit mt-6 mb-2" disabled={!nAppls}>
				Create {nAppls} application{nAppls !== 1 ? 's' : ''}
			</Button>
		</form>
	</div>
</div>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		{toastMessage}. Check <A href={`/student/${data.studentId}`}>the student&rsquo;s page</A>.
	</Toast>
{/if}

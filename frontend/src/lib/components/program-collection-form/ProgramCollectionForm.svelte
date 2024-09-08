<script lang="ts">
	import {
		Alert,
		Button,
		Checkbox,
		Heading,
		Helper,
		Input,
		Label,
		P,
		Select
	} from 'flowbite-svelte';

	import { InfoCircleOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';

	import type { School } from '$lib/api/school';
	import type { ProgramListItem } from '$lib/api/program';
	import StagedApplicationCard from '$lib/components/application-prep-form/StagedApplicationCard.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import { enhanceDisplayName, orderByName } from '$lib/utils/programUtils';

	export let schools: Promise<School[]>;
	export let programs: Promise<ProgramListItem[]>;
	export let collectionForm: SuperValidated<any>;
	export let action: string;
	export let userId: number;

	let showToast = false;

	const { form, enhance } = superForm(collectionForm, {
		dataType: 'json',
		onUpdated({ form }) {
			if (!form.valid) {
				showToast = true;
			}
		}
	});

	let buttonText = 'Update';

	if (!$form.id) {
		$form.created_by = userId;
		buttonText = 'Create';
	}

	let schoolId: number | '' = '';
	let programId: number | '' = '';
	let prepError = '';

	const stageProgram = () => {
		if (typeof programId !== 'number') {
			return;
		}

		if ($form.programs.includes(programId)) {
			prepError = 'You have already selected this program.';
			return;
		}
		prepError = '';
		$form.programs = [...$form.programs, programId as number];
		programId = '';
	};

	const removeStaged = (index: number) => {
		$form.programs = $form.programs.slice(0, index).concat($form.programs.slice(index + 1));
	};
</script>

<form class="grid grid-cols-2 gap-4" method="post" {action} use:enhance>
	{#await Promise.all([schools, programs])}
		<FetchingDataSign text="Preparing your form..." />
	{:then [schools, programs]}
		<div class="form-width">
			<input type="number" name="created_by" class="hidden" value={$form.created_by} />

			<Label class="form-label !mt-0">Is this a public collection?</Label>
			<Helper class="form-helper mt-2">
				<P class="text-xs text-inherit">
					A public collection is visible to everyone, though only editable by the creator and the
					admin. A private collection (the default) is only visible to and editable by the creator.
				</P>
			</Helper>

			<Checkbox class="form-checkbox !mt-4" bind:checked={$form.is_public}>
				<div>Make this collection public</div>
			</Checkbox>

			<Label for="name" class="form-label">Name of the collection</Label>
			<Input id="name" type="text" name="name" maxlength="50" bind:value={$form.name} required />
			<Helper class="form-helper mt-2">
				Provide a self-explanatory name. Names of public collections must be unique.
			</Helper>

			<Alert color="blue" class="form-width flex gap-2 mt-8">
				<InfoCircleOutline />
				<span>
					Use the form below to select programs. The ones you&rsquo;ve selected will appear on the
					right. When done, click <strong>Create</strong>.
				</span>
			</Alert>

			<Label for="school" class="form-label">School</Label>
			<Select id="school" bind:value={schoolId}>
				{#each schools.sort((a, b) => a.name.localeCompare(b.name)) as school}
					<option value={school.id}>{school.name}</option>
				{/each}
			</Select>

			<Label for="program" class="form-label">Program</Label>
			<Select id="program" bind:value={programId}>
				{#each programs
					.filter((p) => p.schools.map((s) => s.id).includes(schoolId || 0))
					.sort(orderByName) as program}
					<option value={program.id}>{enhanceDisplayName(program)}</option>
				{/each}
			</Select>

			<Button
				outline
				type="button"
				class="mt-8 w-full"
				on:click={stageProgram}
				disabled={!programId}
			>
				Select<ChevronDoubleRightOutline class="ms-2" />
			</Button>
			{#if prepError}
				<Helper class="form-helper mt-4 flex items-center font-medium !text-red-500">
					{prepError}
				</Helper>
			{/if}
		</div>

		<div class="h-fit min-h-[10rem] flex flex-col px-8 py-6 rounded-lg bg-stone-50">
			<Heading tag="h2" class="section-title mb-4">Selected programs</Heading>

			<div class="flex flex-col gap-4">
				{#each programs.filter((p) => $form.programs.includes(p.id)) as program, i}
					<StagedApplicationCard item={{ program }} onRemove={() => removeStaged(i)} />
				{/each}
			</div>

			{#if !$form.programs.length}
				<NoDataSign text="You have not selected any program." divClass="mt-2" />
			{/if}
			<Button type="submit" class="w-fit mt-6 mb-2" disabled={!$form.programs.length}>
				{buttonText} collection
			</Button>
		</div>
	{/await}
</form>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		Sorry, something went wrong. Your collection may not have been created or updated. Did you
		choose a name that&rsquo;s already in use by a public collection?
	</Toast>
{/if}

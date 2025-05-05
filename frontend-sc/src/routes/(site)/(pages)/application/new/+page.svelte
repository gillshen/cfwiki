<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { type Selected } from 'bits-ui';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import * as Select from '$lib/components/ui/select/index';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import Textarea from '$lib/components/forms/Textarea.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import SchoolForm from '$lib/components/forms/SchoolForm.svelte';

	import { orderByName } from '$lib/util/schoolUtils';
	import { enhanceDisplayName, orderByName as orderByProgramName } from '$lib/util/programUtils';
	import { formatRound, orderByDueDate, orderByRoundName } from '$lib/util/applicationRoundUtils';
	import { groupByCfPerson, leftEarly } from '$lib/util/serviceUtils';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;

	const form = superForm(data.newApplicationForm);
	const { form: formData, enhance } = form;

	const schoolForm = superForm(data.newSchoolForm, {
		onUpdated({ form }) {
			// set school selection
			$formData._school = form.data.name;
		}
	});
	const { enhance: schoolFormEnhance } = schoolForm;

	const groupedServices = Object.entries(groupByCfPerson(data.contract.services)).sort();

	const selectedStaff: Selected<string>[] = $formData.staff_names.length
		? $formData.staff_names.map((s) => ({ value: s, label: s }))
		: groupedServices
				.filter(([, services]) => services.map((s) => !leftEarly(s)).some(Boolean))
				.map(([cfUsername]) => ({ value: cfUsername, label: cfUsername }));

	$: {
		if (!$formData.major_1) {
			$formData.major_2 = '';
		}
		if (!$formData.major_2) {
			$formData.major_3 = '';
		}
	}

	// Runs on initial load AND whenever the page URL changes
	$: {
		// console.log('Page URL changed:', $page.url);
		// console.table(data.contract);
		$formData.staff_names = selectedStaff.map((item) => item.value);
	}

	let schoolFormOpen = false;
</script>

<svelte:head>
	<title>{createTitle('Create Application')}</title>
</svelte:head>

<BreadcrumbContainer>
	<Breadcrumb.Item>Applications</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

{#await Promise.all([data.schools, data.programs, data.applicationRounds, data.applications])}
	<LoadingSign />
{:then [schools, programs, applicationRounds, applications]}
	<div class="flex justify-between space-between gap-12">
		<section>
			<h1 class="page-title">Create Application</h1>

			<div class="text-sm flex gap-2 pt-2 pb-6">
				<div><a href="/student/{data.studentId}">{data.contract.student_name}</a></div>
				<div class="text-gray-400">&bullet;</div>
				<div>{data.programType}</div>
				<div class="text-gray-400">&bullet;</div>
				<div>{data.term} {data.year}</div>
			</div>

			<form
				method="POST"
				class="max-w-prose space-y-6"
				action="?/createApplication"
				use:enhance
				id="application-form"
			>
				<Combobox
					{form}
					name="_school"
					label="School"
					width="w-[480px]"
					items={schools.sort(orderByName).map((school) => school.name)}
					onSelect={() => {
						$formData._program = '';
						$formData.round = 0;
					}}
				>
					<div slot="if-not-found">
						<ButtonDialog
							buttonVariant="secondary"
							buttonText="Add School"
							buttonClass="mt-4 mx-auto"
							contentClass="min-w-[529px]"
							dialogTitle="Create School Profile"
							open={schoolFormOpen}
						>
							<form
								method="POST"
								action="?/createSchool"
								class="flex flex-col gap-4 items-start justify-start"
								use:schoolFormEnhance
								id="school-form"
							>
								<SchoolForm form={schoolForm} />
							</form>
						</ButtonDialog>
					</div>
				</Combobox>

				<Combobox
					{form}
					name="_program"
					label="Program"
					width="w-[480px]"
					items={programs
						.filter((p) => p.schools.map((s) => s.name).includes($formData._school))
						.sort(orderByProgramName)
						.map((p) => ({ label: enhanceDisplayName(p), value: p.id.toString() }))}
					onSelect={() => {
						$formData.round = 0;
					}}
					disableSearch
				/>

				<Combobox
					{form}
					name="round"
					label="Admission plan"
					width="w-[300px]"
					items={applicationRounds
						.filter((r) => r.program_iteration.program.toString() === $formData._program)
						.sort(orderByRoundName)
						.sort(orderByDueDate)
						.map((r) => ({ label: formatRound(r), value: r.id.toString() }))}
					disableSearch
				/>

				<FormField {form} name="staff_names" class="w-[480px] pb-0.5">
					<Form.Control let:attrs>
						<Form.Label>Staff</Form.Label>
						<Select.Root
							multiple
							selected={selectedStaff}
							onSelectedChange={(v) => {
								if (v) {
									$formData.staff_names = v.map((item) => item.value).sort();
								}
								console.log($formData.staff_names);
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select at least one option" />
							</Select.Trigger>
							<Select.Content>
								{#each groupedServices as [cfUsername]}
									<Select.Item value={cfUsername} label={cfUsername} />
								{/each}
							</Select.Content>
						</Select.Root>
						<select name="staff_names" multiple bind:value={$formData.staff_names} hidden>
							{#each groupedServices as [cfUsername]}
								<option value={cfUsername}>{cfUsername}</option>
							{/each}
						</select>
					</Form.Control>
					<Form.Description
						>Select all and only those involved in this particular application</Form.Description
					>
					<Form.FieldErrors />
				</FormField>

				<Input
					{form}
					name="major_1"
					label="First-choice major or track"
					maxlength={100}
					inputClass="w-[480px]"
					optional
				/>

				{#if $formData.major_1.trim()}
					<Input
						{form}
						name="major_2"
						label="Second-choice major or track"
						maxlength={100}
						inputClass="w-[480px]"
						optional
					/>

					{#if $formData.major_2.trim()}
						<Input
							{form}
							name="major_3"
							label="Third-choice major or track"
							maxlength={100}
							inputClass="w-[480px]"
							optional
						/>
					{/if}
				{/if}

				<Textarea
					{form}
					name="comments"
					label="Comments"
					class="w-[480px]"
					maxlength={1000}
					description="Anything you want to note about this application"
					optional
				/>

				<input name="contract" type="number" value={data.contract.id} class="hidden" />

				<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			</form>
		</section>

		<section class="text-sm flex flex-col min-h-[120px]">
			{#if applications.length}
				<div
					class="py-4 px-8 border rounded-t-lg backdrop-blur bg-muted/70 shadow-sm z-10 flex items-center"
				>
					<h2 class="text-base font-semibold">{data.term} {data.year} Applications</h2>
					<Badge variant="outline" class="ml-4 min-w-8 h-5 justify-center bg-popover"
						>{applications.length}</Badge
					>
				</div>
				<!-- Workaround for a Firefox bug where backdrop-blur does not work with rounded corners  -->
				<div
					id="existing-applications-list"
					class="max-h-[calc(100vh-168px)] -mt-[56px] pt-[56px] flex flex-col rounded-lg border overflow-auto overscroll-none px-2"
				>
					{#each applications.sort().reverse() as application, index}
						{#if index}
							<Separator />
						{/if}
						<a href="/application/{application.id}" target="_self" class="hover:no-underline">
							<StudentApplicationCard
								{application}
								compact
								hideYear
								class="border-none shadow-none w-[370px]"
							/>
						</a>
					{/each}
				</div>
			{/if}
		</section>
	</div>
{/await}

<style>
	#existing-applications-list::-webkit-scrollbar-track {
		margin-block-start: calc(56px + 2px);
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';

	import { superForm } from 'sveltekit-superforms';
	import { type Selected } from 'bits-ui';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import * as Select from '$lib/components/ui/select/index';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';

	import { orderByName } from '$lib/util/schoolUtils';
	import { enhanceDisplayName, orderByName as orderByProgramName } from '$lib/util/programUtils';
	import { formatRound, orderByDueDate, orderByRoundName } from '$lib/util/applicationRoundUtils';
	import { groupByCfPerson, leftEarly } from '$lib/util/serviceUtils';

	export let data;

	const form = superForm(data.newApplicationForm);
	const { form: formData, enhance } = form;

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
		console.log('Page URL changed:', $page.url);
		console.table(data.contract);
		$formData.staff_names = selectedStaff.map((item) => item.value);
	}
</script>

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
	<div class="grid grid-cols-[1fr_400px] gap-12">
		<section>
			<h1 class="page-title mb-2">Create Application</h1>

			<div class="text-sm flex gap-2 pt-2 pb-6">
				<div><a href={`/student/${data.studentId}`}>{data.contract.student_name}</a></div>
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
					items={schools
						.sort(orderByName)
						.map((school) => ({ value: school.name, label: school.name }))}
					onSelect={() => {
						$formData._program = '';
						$formData.round = 0;
					}}
				/>

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

				<FormField {form} name="major_1">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">First-choice major or track</Form.Label>
						<Input maxlength={100} class="w-[480px]" {...attrs} bind:value={$formData.major_1} />
					</Form.Control>
				</FormField>

				{#if $formData.major_1.trim()}
					<FormField {form} name="major_2">
						<Form.Control let:attrs>
							<Form.Label class="optional-field">Second-choice major or track</Form.Label>
							<Input maxlength={100} class="w-[480px]" {...attrs} bind:value={$formData.major_2} />
						</Form.Control>
					</FormField>

					{#if $formData.major_2.trim()}
						<FormField {form} name="major_3">
							<Form.Control let:attrs>
								<Form.Label class="optional-field">Third-choice major or track</Form.Label>
								<Input
									maxlength={100}
									class="w-[480px]"
									{...attrs}
									bind:value={$formData.major_3}
								/>
							</Form.Control>
						</FormField>
					{/if}
				{/if}

				<Form.Field {form} name="comments" class="max-w-[480px]">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">Comments</Form.Label>
						<Textarea rows={4} maxlength={1000} {...attrs} bind:value={$formData.comments} />
					</Form.Control>
					<Form.Description>Anything you want to note about this application</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<input name="contract" type="number" value={data.contract.id} class="hidden" />

				<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			</form>

			<!-- <div class="mt-12 max-w-prose w-fit">
				<SuperDebug data={$formData} />
			</div> -->
		</section>

		<section class="text-sm flex flex-col gap-4 min-h-[120px]">
			{#if applications.length}
				<h2 class="text-xl font-bold pt-3">Already Applied</h2>

				<ScrollArea class="max-h-[75vh] rounded-md border">
					<div class="px-4">
						{#each applications.sort().reverse() as application, index}
							{#if index}
								<Separator />
							{/if}
							<a href={`/application/${application.id}`} target="_self" class="hover:no-underline">
								<StudentApplicationCard {application} compact class="border-none shadow-none" />
							</a>
						{/each}
					</div>
				</ScrollArea>
			{/if}
		</section>
	</div>
{/await}

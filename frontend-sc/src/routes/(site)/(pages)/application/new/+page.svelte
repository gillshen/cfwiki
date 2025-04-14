<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Form from '$lib/components/ui/form/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import FormField from '$lib/components/ui/form/form-field.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { orderByName } from '$lib/util/schoolUtils';
	import { enhanceDisplayName, orderByName as orderByProgramName } from '$lib/util/programUtils';
	import { formatRound, orderByDueDate, orderByRoundName } from '$lib/util/applicationRoundUtils';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { groupByCfPerson, orderByRole } from '$lib/util/serviceUtils';

	export let data;

	const { studentId, contract, programType, year, term, applications } = data;

	const groupedServices = Object.entries(groupByCfPerson(contract.services.sort(orderByRole)));

	const form = superForm(data.newApplicationForm);
	const { form: formData, enhance } = form;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>Applications</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>New</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<h1 class="page-title mb-2">Create Application</h1>

<div class="text-sm flex gap-2 pt-2 pb-6">
	<div>{data.contract.student_name}</div>
	<div class="text-gray-400">&bullet;</div>
	<div>{data.programType}</div>
	<div class="text-gray-400">&bullet;</div>
	<div>{data.term} {data.year}</div>
</div>

<div class="grid grid-cols-[1fr_400px] gap-8">
	<section>
		{#await Promise.all([data.schools, data.programs, data.applicationRounds])}
			<LoadingSign />
		{:then [schools, programs, applicationRounds]}
			<form
				method="POST"
				class="max-w-prose space-y-6 mt-4"
				action="?/createApplication"
				use:enhance
				id="application-form"
			>
				<input name="contract" type="number" value={contract.id} class="hidden" />

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

				<div class="flex flex-col gap-2">
					<Label class="pb-1">Staff</Label>

					{#each groupedServices as [cfUsername, services]}
						{@const checkId = `cf-${cfUsername}-check`}
						<div class="flex items-center space-x-2">
							<Checkbox id={checkId} />
							<Label for={checkId} class="font-normal"
								>{cfUsername} - {services.map((s) => s.role).join('/')}</Label
							>
						</div>
					{/each}
				</div>

				<FormField {form} name="major_1">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">First-choice major or track</Form.Label>
						<Input maxlength={100} class="w-[480px]" {...attrs} bind:value={$formData.major_1} />
					</Form.Control>
				</FormField>

				<FormField {form} name="major_2">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">Second-choice major or track</Form.Label>
						<Input maxlength={100} class="w-[480px]" {...attrs} bind:value={$formData.major_2} />
					</Form.Control>
				</FormField>

				<FormField {form} name="major_3">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">Third-choice major or track</Form.Label>
						<Input maxlength={100} class="w-[480px]" {...attrs} bind:value={$formData.major_3} />
					</Form.Control>
				</FormField>

				<Form.Field {form} name="comments" class="max-w-[480px]">
					<Form.Control let:attrs>
						<Form.Label class="optional-field">Comments</Form.Label>
						<Textarea rows={4} maxlength={1000} {...attrs} bind:value={$formData.comments} />
					</Form.Control>
					<Form.Description>Anything you want to note about this application</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			</form>
		{/await}

		<div class="mt-12 max-w-prose">
			<SuperDebug data={$formData} />
		</div>

		<pre class="mt-4 text-sm bg-zinc-50 p-2 rounded-md">{JSON.stringify(
				{ studentId, contract, programType, year, term },
				null,
				2
			)}</pre>
	</section>

	<section class="text-sm flex flex-col gap-4">
		{#await applications}
			<LoadingSign />
		{:then applications}
			{#each applications as application}
				<a href={`/application/${application.id}`} target="_self" class="hover:no-underline">
					<StudentApplicationCard {application} />
				</a>
			{/each}
		{/await}
	</section>
</div>

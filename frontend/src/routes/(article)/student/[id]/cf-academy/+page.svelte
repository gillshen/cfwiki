<script lang="ts">
	import {
		Heading,
		Hr,
		Breadcrumb,
		BreadcrumbItem,
		Alert,
		Label,
		Select,
		Helper,
		A,
		Button
	} from 'flowbite-svelte';

	import {
		InfoCircleOutline,
		ChevronDoubleRightOutline,
		CloseCircleOutline
	} from 'flowbite-svelte-icons';

	import { superForm } from 'sveltekit-superforms';

	import type { AcademyProgramListItem } from '$lib/api/academyProgram';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import StagedAcademyProgramCard from '$lib/components/student-page/StagedAcademyProgramCard.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import AcademyProgramForm from '$lib/components/academy-program-form/AcademyProgramForm.svelte';
	import Toast from '$lib/components/misc/Toast.svelte';
	import { canEditStudent } from '$lib/utils/userUtils';
	import { orderByCategoryName } from '$lib/utils/academyProgramUtils';
	import { addChinesePadding } from '$lib/utils/stringUtils';

	export let data;

	$: canEdit = canEditStudent(data.username, data.student);

	let showToast = false;

	const { form, enhance } = superForm(data.programsUpdateForm, {
		dataType: 'json',
		onUpdated({ form }) {
			if (!form.valid) {
				showToast = true;
			}
		}
	});

	let programId: number | '';
	let programModal = false;
	let prepError = '';

	const stageProgram = () => {
		if (typeof programId !== 'number') {
			return;
		}

		if ($form.cf_academy_programs.includes(programId)) {
			prepError = 'You have already selected this program.';
			return;
		}
		prepError = '';
		$form.cf_academy_programs = [...$form.cf_academy_programs, programId as number];
		programId = '';
	};

	const removeStaged = (program: AcademyProgramListItem) => {
		const index = $form.cf_academy_programs.findIndex((id: number) => id === program.id);
		$form.cf_academy_programs = $form.cf_academy_programs
			.slice(0, index)
			.concat($form.cf_academy_programs.slice(index + 1));
	};
</script>

<Heading tag="h1" class="alt-page-title">{data.student.fullname} @ CF Academy</Heading>

<Hr />

{#if canEdit}
	<Breadcrumb class="mb-8">
		<BreadcrumbLink text={data.student.fullname} href={`/student/${data.student.id}`} />
		<BreadcrumbItem>CF Academy</BreadcrumbItem>
	</Breadcrumb>

	<form
		class="grid grid-cols-2 gap-4"
		method="post"
		action="?/updateStudentAcademyPrograms"
		use:enhance
	>
		{#await data.programs}
			<FetchingDataSign divClass="mt-6" text="Preparing your form..." />
		{:then programs}
			<div>
				<Alert color="light" class="form-width flex gap-2">
					<InfoCircleOutline />
					<span>
						Use the form below to select programs. The ones you&rsquo;ve selected will appear on the
						right. When done, click <strong>Update</strong>.
					</span>
				</Alert>

				<div class="form-width">
					<Label for="program" class="form-label">Program</Label>
					<Select id="program" bind:value={programId}>
						{#each programs.sort(orderByCategoryName) as program}
							<option value={program.id}>{addChinesePadding(program.name)}</option>
						{/each}
					</Select>
					<Helper class="form-helper mt-2">
						If your desired program is not listed, go to <A href="/cf-academy">this page</A> and create
						it.
					</Helper>

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
			</div>

			<div class="h-fit min-h-[10rem] flex flex-col px-8 py-6 rounded-lg bg-stone-50">
				<Heading tag="h2" class="section-title mb-4">Selected programs</Heading>

				<div class="flex flex-col gap-4">
					{#each programs
						.filter((p) => $form.cf_academy_programs.includes(p.id))
						.sort(orderByCategoryName) as program}
						<StagedAcademyProgramCard item={program} onRemove={() => removeStaged(program)} />
					{/each}
				</div>

				<Button type="submit" class="w-fit mt-6 mb-2">Update</Button>
			</div>
		{/await}
	</form>
{:else}
	<Alert color="red" class="flex gap-2 max-w-prose">
		<CloseCircleOutline />
		<span>You are not authorized to access this page.</span>
	</Alert>
{/if}

<FormModal
	open={programModal}
	superform={data.newProgramForm}
	fields={AcademyProgramForm}
	action="?/createAcademyProgram"
	title="Create an Academy program"
	on:close={() => (programModal = false)}
/>

{#if showToast}
	<Toast type="error" onClose={() => (showToast = false)}>
		Sorry, something went wrong. Please try again later.
	</Toast>
{/if}

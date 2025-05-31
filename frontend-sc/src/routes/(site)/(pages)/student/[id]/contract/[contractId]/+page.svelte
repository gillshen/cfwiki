<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import Receipt from 'lucide-svelte/icons/receipt';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Users from 'lucide-svelte/icons/users';
	import Plus from 'lucide-svelte/icons/plus';

	import * as StudentPage from '$lib/components/widgets/student-page/';
	import ServiceForm from '$lib/components/forms/ServiceForm.svelte';
	import ServiceActionItem from '$lib/components/widgets/ServiceActionItem.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import RadioGroup from '$lib/components/forms/RadioGroup.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';

	import { CONTRACT_STATUSES } from '$lib/api/contract';
	import { createTitle } from '$lib/util/siteUtils';
	import { orderByRoleUsername } from '$lib/util/serviceUtils';

	import {
		allProgsWithContractTerms,
		secondaryProgsWithContractTerms,
		universityProgsWithContractTerms
	} from '$lib/constants/progressions';

	export let data;

	let contractUpdateModal = false;

	const contractForm = superForm(data.contractForm, {
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				contractUpdateModal = false;
			}
		}
	});
	const { enhance: contractFormEnhance } = contractForm;

	let contractDeleteModal = false;
	let newServiceModal = false;

	const title = `${data.student.fullname} \u2022 ${data.contract.type} ${data.contract.target_year}`;

	let progressions: string[];

	$: {
		if (data.contract.type === 'UG Freshman') {
			progressions = [...secondaryProgsWithContractTerms];
		} else if (data.contract.type === 'UG Transfer' || data.contract.type === 'Graduate') {
			progressions = [
				...secondaryProgsWithContractTerms.filter((p) => p.startsWith('G12')),
				...universityProgsWithContractTerms
			];
		} else {
			progressions = [...allProgsWithContractTerms];
		}
	}
</script>

<svelte:head>
	<title>{createTitle(title)}</title>
</svelte:head>

<StudentPage.Layout>
	<svelte:fragment slot="breadcrumb">
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page class="inline-flex items-center"
				><Receipt class="size-3.5 mr-1.5" />{data.contract.type}</Breadcrumb.Page
			>
		</Breadcrumb.Item>
	</svelte:fragment>

	<StudentPage.Header student={data.student} slot="header" />

	<StudentPage.Section title="Update Contract" icon={Pencil} class="mt-[72px]" contentClass="px-12">
		<form
			method="POST"
			class="max-w-prose min-w-[450px] space-y-4 my-4"
			action="?/updateContract"
			use:contractFormEnhance
			id="contract-form"
		>
			<input type="number" name="id" bind:value={data.contract.id} hidden />
			<input type="number" name="student" bind:value={data.student.id} hidden />

			<Input form={contractForm} name="type" label="Type" class="pb-1.5" disabled />
			<input name="type" bind:value={data.contract.type} hidden />

			<Input form={contractForm} name="target_year" label="Target year" class="pb-1.5" disabled />
			<input type="number" name="target_year" bind:value={data.contract.target_year} hidden />

			<RadioGroup form={contractForm} name="status" label="Status" items={[...CONTRACT_STATUSES]} />
			<Input
				form={contractForm}
				name="date"
				label="Effective date"
				type="date"
				class="pb-1.5"
				optional
			/>
			<Combobox
				form={contractForm}
				name="student_progression_when_signed"
				label="Student progression"
				items={progressions}
				optional
			/>
			<Form.Button class="w-fit min-w-24">Save changes</Form.Button>
		</form>
	</StudentPage.Section>

	<StudentPage.Section
		title="Manage Staff"
		icon={Users}
		class="mt-8"
		footer
		contentClass="px-12"
		footerClass="px-12"
	>
		{#if data.contract.services.length}
			<div class="flex flex-col gap-6 my-2">
				{#each data.contract.services.sort(orderByRoleUsername) as service}
					<StudentPage.Service {service}>
						<div class="flex items-center gap-4" slot="actions">
							<ServiceActionItem
								{service}
								contractId={data.contract.id}
								updateForm={data.serviceForm}
								deleteForm={data.deleteForm}
							/>
						</div>
					</StudentPage.Service>
				{/each}
			</div>
		{:else}
			No record
		{/if}

		<ButtonDialog
			slot="footer"
			buttonSlot
			dialogTitle="Add staff member"
			bind:open={newServiceModal}
		>
			<Button
				slot="button"
				variant="ghost"
				size="icon"
				class="bg-white border rounded-full shadow-md mt-4"><Plus class="size-4" /></Button
			>
			<ServiceForm
				data={data.serviceForm}
				cfUsers={data.cfUsers}
				contractId={data.contract.id}
				onUpdated={({ form }) => form.valid && (newServiceModal = false)}
			/>
		</ButtonDialog>
	</StudentPage.Section>

	<StudentPage.Section title="" class="mt-8" contentClass="px-12 py-6">
		<ButtonDialog
			buttonText="Delete Contract"
			buttonVariant="destructive"
			buttonClass="w-fit"
			dialogTitle="Delete this contract?"
			contentClass="pb-2"
			bind:open={contractDeleteModal}
		>
			<p slot="description" class="text-pretty">
				Deletion is instant and irreversible. It will also cause all the associated applications to
				be deleted instantly and irreversibly.
			</p>
			<DeleteForm
				data={data.deleteForm}
				objectId={data.contract.id}
				action="?/deleteContract"
				onUpdated={({ form }) => form.valid && (contractDeleteModal = false)}
				onCancel={() => (contractDeleteModal = false)}
			/>
		</ButtonDialog>
	</StudentPage.Section>
</StudentPage.Layout>

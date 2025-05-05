<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Table from '$lib/components/ui/table/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import X from 'lucide-svelte/icons/x';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import PencilEditButton from '$lib/components/misc/PencilEditButton.svelte';
	import ContractStatusSign from '$lib/components/misc/ContractStatusSign.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Tooltip from '$lib/components/containers/Tooltip.svelte';
	import { createTitle } from '$lib/util/siteUtils';
	import { contractStatuses } from '$lib/api/contract';
	import { orderByRoleUsername } from '$lib/util/serviceUtils';
	import { toShortDate } from '$lib/util/dateUtils';

	import {
		allProgsWithContractTerms,
		secondaryProgsWithContractTerms,
		universityProgsWithContractTerms
	} from '$lib/constants/progressions';

	export let data;

	let contractFormOpen = false;
	const contractForm = superForm(data.contractForm, {
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				contractFormOpen = false;
			}
		}
	});
	const { enhance: contractFormEnhance } = contractForm;

	let deleteModalOpen = false;
	const contractDeleteFrom = superForm(data.contractDeleteForm, { id: 'contract-delete' });
	const { enhance: contractDeleteFormEnhance } = contractDeleteFrom;

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

<BreadcrumbContainer>
	<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	<Breadcrumb.Separator />
	<Breadcrumb.Link href="/student/{data.student.id}">{data.student.fullname}</Breadcrumb.Link>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>Contract</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2 pb-4">
	<h1 class="page-title flex gap-2">
		<div>{data.student.fullname}</div>
		<div>&bullet;</div>
		<div>{data.contract.type} {data.contract.target_year}</div>
	</h1>
	<div class="flex flex-row gap-2 items-center text-sm h-5">
		<ContractStatusSign status={data.contract.status} />
		{#if data.contract.date}
			<div class="text-muted-foreground/50">&bullet;</div>
			<Tooltip text="Date of signature">
				{toShortDate(data.contract.date)}
			</Tooltip>
		{/if}
		{#if data.contract.student_progression_when_signed}
			<div class="text-muted-foreground/50">&bullet;</div>
			<Tooltip text="Student progression when signed">
				{data.contract.student_progression_when_signed}
			</Tooltip>
		{/if}
		<ButtonDialog buttonSlot dialogTitle="Update Contract" bind:open={contractFormOpen}>
			<PencilEditButton slot="button" />
			<form
				method="POST"
				class="max-w-prose space-y-4 my-4 mx-auto"
				action="?/updateContract"
				use:contractFormEnhance
				id="contract-form"
			>
				<input type="number" name="id" bind:value={data.contract.id} hidden />
				<input type="number" name="student" bind:value={data.student.id} hidden />
				<input name="type" bind:value={data.contract.type} hidden />
				<input type="number" name="target_year" bind:value={data.contract.target_year} hidden />

				<Combobox
					form={contractForm}
					name="status"
					label="Status"
					items={Array.from(contractStatuses)}
				/>
				<Input
					form={contractForm}
					name="date"
					label="Date signed"
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
				<Form.Button class="w-fit min-w-24">Submit</Form.Button>
			</form>
		</ButtonDialog>
	</div>
</section>

<Section id="team" title="Team" hrule={false}>
	<div class="border rounded-md w-fit">
		<Table.Root class="w-[800px]">
			<Table.Header>
				<Table.Row>
					<Table.Head class="font-semibold min-w-[100px]">CFer</Table.Head>
					<Table.Head class="font-semibold min-w-[100px]">Role</Table.Head>
					<Table.Head class="font-semibold min-w-[120px]">Start Date</Table.Head>
					<Table.Head class="font-semibold min-w-[120px]">End Date</Table.Head>
					<Table.Head class="font-semibold w-[90px] flex-grow-0"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.contract.services.sort(orderByRoleUsername) as service}
					<Table.Row>
						<Table.Cell>
							<a href="/cf/{service.cf_username}" class="text-inherit">{service.cf_username}</a>
						</Table.Cell>
						<Table.Cell>{service.role}</Table.Cell>
						<Table.Cell>{service.start_date || 'Start of contract'}</Table.Cell>
						<Table.Cell>{service.end_date || 'End of contract'}</Table.Cell>
						<Table.Cell class="flex items-center gap-4 pr-6">
							<ButtonDialog buttonSlot dialogTitle="Update Team Membership">
								<Pencil
									class="size-4 text-muted-foreground hover:text-secondary-foreground/80 translate-y-[1px]"
									slot="button"
								/>
								<form>form</form>
							</ButtonDialog>

							<ButtonDialog
								buttonSlot
								dialogTitle="Remove {service.cf_username} as {service.role} from the team?"
							>
								<X
									class="size-4 text-muted-foreground hover:text-secondary-foreground/80 translate-y-[1px]"
									slot="button"
								/>
								<form>form</form>
							</ButtonDialog>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<ButtonDialog
		buttonVariant="outline"
		buttonText="Add Team Member"
		dialogTitle="Add Team Member"
		buttonClass="w-fit mt-4"
	>
		<form>form</form>
	</ButtonDialog>
</Section>

<Section id="delete" hrule>
	<ButtonDialog
		buttonText="Delete Contract"
		buttonVariant="destructive"
		buttonClass="w-fit"
		dialogTitle="Delete this contract?"
		bind:open={deleteModalOpen}
	>
		<p slot="description">
			Deleting the contract will also delete all the applications associated with it. This action
			cannot be undone.
		</p>
		<form
			method="POST"
			class="max-w-prose space-y-4 pb-2"
			action="?/deleteContract"
			use:contractDeleteFormEnhance
			id="contract-delete-form"
		>
			<input type="number" name="id" bind:value={data.contract.id} hidden />
			<div class="mx-auto mt-4 w-fit">
				<Form.Button variant="destructive" class="w-fit min-w-24">Delete</Form.Button>
				<Button variant="ghost" on:click={() => (deleteModalOpen = false)}>Cancel</Button>
			</div>
		</form>
	</ButtonDialog>
</Section>

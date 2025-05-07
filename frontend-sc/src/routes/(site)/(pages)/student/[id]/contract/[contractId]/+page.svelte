<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { cn } from '$lib/utils';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import * as Table from '$lib/components/ui/table/index';
	import * as Card from '$lib/components/ui/card/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import ServiceForm from '$lib/components/forms/service-form/ServiceForm.svelte';
	import ServiceActionItem from '$lib/components/widgets/ServiceActionItem.svelte';
	import DeleteForm from '$lib/components/forms/DeleteForm.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import Input from '$lib/components/forms/Input.svelte';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import PencilEditButton from '$lib/components/misc/PencilEditButton.svelte';
	import ContractStatusSign from '$lib/components/misc/ContractStatusSign.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Tooltip from '$lib/components/containers/Tooltip.svelte';

	import { CONTRACT_STATUSES } from '$lib/api/contract';
	import { createTitle } from '$lib/util/siteUtils';
	import { formatDates, orderByRoleUsername } from '$lib/util/serviceUtils';
	import { toShortDate } from '$lib/util/dateUtils';

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

	$: hasServices = !!data.contract.services.length;

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
		<div class="scale-[80%]">&bullet;</div>
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
		<ButtonDialog buttonSlot dialogTitle="Update Contract" bind:open={contractUpdateModal}>
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

				<Combobox form={contractForm} name="status" label="Status" items={[...CONTRACT_STATUSES]} />
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

<Section id="team" class="mt-4">
	<Card.Root class={cn('shadow-none', hasServices ? 'w-fit' : 'w-[450px]')}>
		<Card.Header>
			<Card.Title class="tracking-normal">CF Team</Card.Title>
			{#if !hasServices}
				<Card.Description
					><p class="text-balance">Make sure you add yourself first.</p></Card.Description
				>
			{/if}
		</Card.Header>
		<Card.Content class="min-h-[234px] flex">
			{#if hasServices}
				<Table.Root class="w-[653px]">
					<Table.Header>
						<Table.Row>
							<Table.Head class="font-semibold min-w-[100px] pl-2">Person</Table.Head>
							<Table.Head class="font-semibold min-w-[100px]">Role</Table.Head>
							<Table.Head class="font-semibold min-w-[120px]">Start Date</Table.Head>
							<Table.Head class="font-semibold min-w-[120px]">End Date</Table.Head>
							<Table.Head class="font-semibold w-[90px] flex-grow-0"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.contract.services.sort(orderByRoleUsername) as service}
							{@const { startDate, endDate } = formatDates({ service, contract: data.contract })}
							<Table.Row>
								<Table.Cell class="pl-2">
									<div class="flex items-center gap-2">
										<UserAvatar username={service.cf_username} class="size-8" imageClass="size-5" />
										<a href="/cf/{service.cf_username}" class="text-inherit"
											>{service.cf_username}</a
										>
									</div>
								</Table.Cell>
								<Table.Cell>{service.role}</Table.Cell>
								<Table.Cell class={service.start_date ? '' : 'text-muted-foreground'}
									>{startDate}</Table.Cell
								>
								<Table.Cell class={service.end_date ? '' : 'text-muted-foreground'}
									>{endDate}</Table.Cell
								>
								<Table.Cell class="flex items-center gap-4 pr-6 h-16">
									<ServiceActionItem
										{service}
										contractId={data.contract.id}
										updateForm={data.serviceForm}
										deleteForm={data.deleteForm}
									/>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<ButtonDialog
					buttonVariant="default"
					buttonText="Add Member"
					dialogTitle="Add Member"
					buttonClass="w-fit m-auto"
					bind:open={newServiceModal}
				>
					<ServiceForm
						data={data.serviceForm}
						cfUsers={data.cfUsers}
						contractId={data.contract.id}
						onUpdated={({ form }) => form.valid && (newServiceModal = false)}
					/>
				</ButtonDialog>
			{/if}
		</Card.Content>
		{#if hasServices}
			<Card.Footer>
				<ButtonDialog
					buttonVariant="outline"
					buttonText="Add Member"
					dialogTitle="Add Member"
					buttonClass="w-fit mt-2"
					bind:open={newServiceModal}
				>
					<ServiceForm
						data={data.serviceForm}
						cfUsers={data.cfUsers}
						contractId={data.contract.id}
						onUpdated={({ form }) => form.valid && (newServiceModal = false)}
					/>
				</ButtonDialog>
			</Card.Footer>
		{/if}
	</Card.Root>
</Section>

<Section id="delete" class="mt-auto">
	<ButtonDialog
		buttonText="Delete Contract"
		buttonVariant="destructive"
		buttonClass="w-fit"
		dialogTitle="Delete this contract?"
		bind:open={contractDeleteModal}
	>
		<p slot="description" class="text-pretty">
			Deleting a contract will also delete all the applications associated with it. This action
			cannot be undone.
		</p>
		<DeleteForm
			data={data.deleteForm}
			objectId={data.contract.id}
			action="?/deleteContract"
			onUpdated={({ form }) => form.valid && (contractDeleteModal = false)}
		/>
	</ButtonDialog>
</Section>

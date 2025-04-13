<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index';
	import * as Form from '$lib/components/ui/form/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { Button } from '$lib/components/ui/button/index';
	import Venus from 'lucide-svelte/icons/venus';
	import Mars from 'lucide-svelte/icons/mars';
	import NonBinary from 'lucide-svelte/icons/non-binary';
	import Pencil from 'lucide-svelte/icons/pencil';
	import LayoutGrid from 'lucide-svelte/icons/layout-grid';
	import List from 'lucide-svelte/icons/list';

	import Section from '$lib/components/containers/Section.svelte';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import Combobox from '$lib/components/forms/Combobox.svelte';
	import ContractCard from '$lib/components/widgets/ContractCard.svelte';
	import StudentApplicationCard from '$lib/components/widgets/StudentApplicationCard.svelte';
	import StudentApplicationsTable from '$lib/components/widgets/StudentApplicationsTable.svelte';

	import countryFlags from '$lib/constants/countries';
	import { formatLocation } from '$lib/util/studentUtils';
	import { superForm } from 'sveltekit-superforms';
	import { orderBySchoolName, orderByStatus, orderByYearDesc } from '$lib/util/applicationUtils';

	export let data;

	let canEdit: boolean = true;

	const form = superForm(data.newApplicationPrepForm);
	const { form: formData, enhance } = form;

	const contractItems = data.student.contracts.map((contract) => ({
		value: contract.id.toString(),
		label: `${contract.type} ${contract.target_year}`
	}));
	const applicationTypes = ['UG Freshman', 'UG Transfer', 'Graduate', 'Non-degree'];
	const applicationTypeItems = applicationTypes.map((value) => ({
		value,
		label: value
	}));
	const yearItems = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029] // TODO
		.map((year) => ({
			value: year.toString(),
			label: year.toString()
		}));
	const termItems = ['Fall', 'Spring', 'Summer', 'Winter'].map((value) => ({
		value,
		label: value
	}));
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>{data.student.fullname}</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<section class="w-fit min-w-[60ch] mb-2 space-y-2 pb-6">
	<h1 class="page-title">
		{data.student.fullname}
		{#if data.student.preferred_name}
			&nbsp;{data.student.preferred_name}
		{/if}
	</h1>
	<div class="flex flex-row gap-1 items-center text-sm">
		{#if data.student.gender === 'female'}
			<Venus class="w-4 h-4" />
		{:else if data.student.gender === 'male'}
			<Mars class="w-4 h-4" />
		{:else}
			<NonBinary class="w-4 h-4" />
		{/if}
		<div class="text-stone-400">&bullet;</div>
		<div>{countryFlags[data.student.citizenship]}</div>
		<div>{data.student.citizenship}</div>
		{#if data.student.date_of_birth}
			<div class="text-stone-400">&bullet;</div>
			<div>b. {data.student.date_of_birth}</div>
		{/if}
		<div class="text-stone-400">&bullet;</div>
		<div>@ {formatLocation(data.student)}</div>

		{#if canEdit}
			<Button variant="link" class="ml-2">
				<Pencil class="mr-1 h-3 w-3" />Edit
			</Button>
		{/if}
	</div>
	{#if data.student.comments}
		<div class="text-sm pb-2 text-stone-600 max-w-[40ch]">{data.student.comments}</div>
	{/if}

	<div class="flex gap-4 flex-wrap pt-2">
		{#each data.student.contracts as contract}
			<ContractCard {contract} />
		{/each}
	</div>

	{#if canEdit}
		<div class="pt-2">
			<ButtonDialog buttonText="Add Contract" dialogTitle="Add Contract">
				<div slot="description">You can staff later</div>
				<div>Dialog body</div>
			</ButtonDialog>
		</div>
	{/if}
</section>

<Section id="education" title="Education">
	<!-- TODO -->
	<pre class="text-sm">{JSON.stringify(data.student.enrollments, null, 2)}</pre>
	{#if canEdit}
		<div class="pt-4">
			<ButtonDialog buttonText="Add Experience" dialogTitle="Add Educational Experience">
				<div>Dialog body</div>
			</ButtonDialog>
		</div>
	{/if}
</Section>

<Section id="test-scores" title="Test Scores">
	<!-- TODO -->
	<pre class="text-sm">{JSON.stringify(data.student.act, null, 2)}</pre>
	<pre class="text-sm">{JSON.stringify(data.student.toefl, null, 2)}</pre>
	{#if canEdit}
		<div class="pt-4">
			<ButtonDialog buttonText="Add Test" dialogTitle="Add Test">
				<div>Dialog body</div>
			</ButtonDialog>
		</div>
	{/if}
</Section>

<Section id="applications" title="Applications">
	<!-- TODO -->
	{#await data.applications}
		<LoadingSign />
	{:then applications}
		{#if applications.length}
			<Tabs.Root value="grid-layout">
				<Tabs.List class="flex w-fit">
					<Tabs.Trigger value="grid-layout"><LayoutGrid class="w-4 h-4" /></Tabs.Trigger>
					<Tabs.Trigger value="table-layout"><List class="w-4 h-4" /></Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="grid-layout">
					<div class="my-4 grid grid-cols-3 gap-4">
						{#each applications
							.sort(orderBySchoolName)
							.sort(orderByStatus)
							.sort(orderByYearDesc) as application}
							<a href={`/application/${application.id}`} target="_self" class="hover:no-underline">
								<StudentApplicationCard {application} />
							</a>
						{/each}
					</div>
				</Tabs.Content>
				<Tabs.Content value="table-layout">
					<StudentApplicationsTable {applications} />
				</Tabs.Content>
			</Tabs.Root>
		{/if}
	{/await}

	{#if canEdit}
		<div class="pt-4">
			<ButtonDialog buttonText="Create Applications" dialogTitle="Create Applications">
				<form
					method="POST"
					action="?/startApplication"
					class="max-w-prose space-y-4 my-4 mx-auto"
					id="new-application-prep-form"
					use:enhance
				>
					<input type="number" name="student" value={data.student.id} class="hidden" />
					<Combobox {form} name="contract" label="Contract" items={contractItems} />
					<Combobox {form} name="type" label="Application type" items={applicationTypeItems} />
					<Combobox {form} name="year" label="Year of admission" items={yearItems} />
					<Combobox {form} name="term" label="Term" items={termItems} />
					<Form.Button class="w-fit min-w-24">Next</Form.Button>
				</form>
			</ButtonDialog>
		</div>
	{/if}
</Section>

{#if canEdit}
	<Section id="delete" hrule>
		<Button variant="destructive" class="mt-4">Delete Profile</Button>
	</Section>
{/if}

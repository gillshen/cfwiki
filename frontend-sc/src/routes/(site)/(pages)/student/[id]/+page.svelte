<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index';
	import Venus from 'lucide-svelte/icons/venus';
	import Mars from 'lucide-svelte/icons/mars';
	import NonBinary from 'lucide-svelte/icons/non-binary';
	import Pencil from 'lucide-svelte/icons/pencil';

	import Section from '$lib/components/containers/Section.svelte';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import ButtonDialog from '$lib/components/containers/ButtonDialog.svelte';
	import ContractCard from '$lib/components/widgets/ContractCard.svelte';

	import countryFlags from '$lib/constants/countries';
	import { formatLocation } from '$lib/util/studentUtils';

	export let data;

	let canEdit: boolean = true;
</script>

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
			<ContractCard {contract} {canEdit} />
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
			<ButtonDialog buttonText="Add School" dialogTitle="Add School">
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
		<pre class="bg-stone-50 rounded-md text-sm h-[300px] overflow-auto p-2">{JSON.stringify(
				applications,
				null,
				2
			)}</pre>
	{/await}
	{#if canEdit}
		<div class="pt-4">
			<ButtonDialog buttonText="Create Applications" dialogTitle="Create Applications">
				<div>Dialog body</div>
			</ButtonDialog>
		</div>
	{/if}
</Section>

{#if canEdit}
	<Section id="delete">
		<Button variant="destructive" class="mt-4">Delete Profile</Button>
	</Section>
{/if}

<!-- <div class="bg-stone-100 w-fit h-[600px] overflow-auto">
	<pre class="text-sm">{JSON.stringify(data, null, 2)}</pre>
</div> -->

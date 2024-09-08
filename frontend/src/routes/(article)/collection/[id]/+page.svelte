<script>
	import { goto } from '$app/navigation';
	import { Alert, Breadcrumb, BreadcrumbItem, Heading, Hr } from 'flowbite-svelte';
	import { ObjectsColumnOutline, InfoCircleOutline } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import ApplicationStatsDoughnut from '$lib/components/application-stats/ApplicationStatsDoughnut.svelte';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import { compose, getStats } from '$lib/utils/applicationUtils';
	import { formatSchoolNames, orderByName, orderBySchoolNames } from '$lib/utils/programUtils';

	export let data;

	let deleteModal = false;
</script>

<Heading tag="h1" class="alt-page-title flex items-center gap-4">
	<ObjectsColumnOutline size="xl" />
	<span>{data.collection.name}</span>
</Heading>

<Hr />

<Main>
	<article>
		<Breadcrumb>
			<BreadcrumbItem href="/collection/index">
				<span class="text-primary-700">Collections</span>
			</BreadcrumbItem>
			<BreadcrumbItem>{data.collection.name}</BreadcrumbItem>
		</Breadcrumb>

		<Heading tag="h2" class="section-title mt-8">Programs</Heading>

		{#if data.collection.programs.length}
			<div class="flex flex-col gap-2 text-sm mt-6">
				{#each data.collection.programs.sort(orderByName).sort(orderBySchoolNames) as program}
					<LinkWithIcon
						href={`/program/${program.id}`}
						text={`${formatSchoolNames(program)} | ${program.display_name}`}
						iconFirst={true}
						spanClass={program.is_defunct ? 'text-gray-400' : ''}
					/>
				{/each}
			</div>
		{:else}
			<NoDataSign text="No program has been added" divClass="mt-6" />
		{/if}

		<!-- TODO allow admin to edit as well -->
		{#if data.username === data.collection.creator_name}
			<div class="mt-8">
				<UpdateDeleteButton
					updateAction={() => goto(`/collection/${data.collection.id}/update`)}
					deleteAction={() => (deleteModal = true)}
				/>
			</div>
		{:else}
			<Alert color="light" class="flex gap-2 mt-8">
				<InfoCircleOutline />
				<span>
					This is a public collection. Anyone can view it, but only its creator and the admin can
					add or remove programs or delete the entire collection.
				</span>
			</Alert>
		{/if}
	</article>

	<article class="bg-stone-50 rounded-xl w-full p-8 h-fit">
		{#await Promise.all([data.applications, data.applicants])}
			<FetchingDataSign />
		{:then [applications, applicants]}
			<ApplicationStatsDoughnut
				stats={getStats(compose(applications, applicants))}
				href={`/collection/${data.collection.id}/stats`}
			/>
		{/await}
	</article>
</Main>

<FormModal
	open={deleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	action="?/deleteProgramCollection"
	title="Delete program collection"
	entity={data.collection}
	on:close={() => (deleteModal = false)}
>
	<DeleteMessage slot="preface" name={`the program collection "${data.collection.name}"`} />
</FormModal>

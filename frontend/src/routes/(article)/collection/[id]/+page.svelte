<script>
	import { Alert, Breadcrumb, BreadcrumbItem, Heading, Hr } from 'flowbite-svelte';
	import { ObjectsColumnOutline, InfoCircleOutline, PenOutline } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import GotoButton from '$lib/components/buttons/GotoButton.svelte';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import ApplicationStatsDoughnut from '$lib/components/application-stats/ApplicationStatsDoughnut.svelte';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';
	import { getStats } from '$lib/utils/applicationUtils';
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
		<Breadcrumb class="mb-8">
			<BreadcrumbLink text="Collections" href="/collection/index" />
			<BreadcrumbItem>{data.collection.name}</BreadcrumbItem>
		</Breadcrumb>

		<Heading tag="h2" class="section-title">Programs</Heading>

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
			<div class="mt-8 flex gap-4 items-baseline">
				<GotoButton
					href={`/collection/${data.collection.id}/update`}
					text="Update"
					icon={PenOutline}
				/>
				<DeleteButton onClick={() => (deleteModal = true)} />
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
		{#await data.applications}
			<FetchingDataSign />
		{:then applications}
			<ApplicationStatsDoughnut
				stats={getStats(applications)}
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
	<DeleteMessage
		slot="preface"
		name={`the program collection \u201c${data.collection.name}\u201d`}
	/>
</FormModal>

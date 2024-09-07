<script>
	import { goto } from '$app/navigation';
	import { Alert, Heading, Hr } from 'flowbite-svelte';
	import { ObjectsColumnOutline, InfoCircleOutline } from 'flowbite-svelte-icons';

	import Main from '$lib/components/containers/Main.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import ApplicationStatsDoughnut from '$lib/components/application-stats/ApplicationStatsDoughnut.svelte';
	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';
	import { compose, getStats } from '$lib/utils/applicationUtils';
	import { formatSchoolNames, orderByName } from '$lib/utils/programUtils';

	export let data;
</script>

<Heading tag="h1" class="alt-page-title flex items-center gap-4">
	<ObjectsColumnOutline size="xl" />
	<span>{data.collection.name}</span>
</Heading>

<Hr />

<Main>
	<article>
		<Alert color={data.collection.is_public ? 'light' : 'pink'} class="flex gap-2">
			<InfoCircleOutline />
			<span>
				This is a public collection. Anyone can view it, though only its creator and the admin can
				add or remove programs or delete the entire collection.
			</span>
		</Alert>

		<Heading tag="h2" class="section-title mt-6">Programs</Heading>

		{#if data.collection.programs.length}
			<div class="flex flex-col gap-2 text-sm mt-6">
				{#each data.collection.programs.sort(orderByName) as program}
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
					deleteAction={() => alert('TODO delete')}
				/>
			</div>
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

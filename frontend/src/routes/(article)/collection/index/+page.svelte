<script lang="ts">
	import { Heading, Hr, Card, A, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import { formatSchoolNamesShort, orderByName } from '$lib/utils/programUtils';

	export let data;
</script>

<Heading tag="h1" class="page-title">Program Collections</Heading>

<Hr />

{#await data.collections}
	<FetchingDataSign divClass="mb-8" />
{:then collections}
	<!-- filter for those that should be visible -->
	<div class="grid grid-cols-3 gap-12 mb-8">
		{#each collections.sort((a, b) => a.name.localeCompare(b.name)) as collection}
			<Card>
				<Heading tag="h3" class="text-xl tracking-wide font-bold mb-1">{collection.name}</Heading>

				<div class="text-sm mb-4">Created by {collection.creator_name}</div>

				{#if collection.programs.length}
					<div class="flex flex-col gap-2 text-sm">
						{#each collection.programs.sort(orderByName) as program}
							<LinkWithIcon
								href={`/program/${program.id}`}
								text={`${formatSchoolNamesShort(program)} | ${program.display_name}`}
								iconFirst={true}
								spanClass={program.is_defunct ? 'text-gray-400' : ''}
							/>
						{/each}
					</div>

					<A href={`/collection/${collection.id}`} class="w-fit text-sm font-medium mt-8">
						View details<ArrowRightOutline class="ms-1" />
					</A>
				{:else}
					<!-- No need to check for user privilege here
					 because users would only see the collections they can edit -->
					<A href={`/collection/${collection.id}/update`} class="w-fit text-sm font-medium mt-4">
						Add programs<ArrowRightOutline class="ms-1" />
					</A>
				{/if}
			</Card>
		{/each}
	</div>
{/await}

<Button outline href={`/collection/new`}>Create a collection</Button>

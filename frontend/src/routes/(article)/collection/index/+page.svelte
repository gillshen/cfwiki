<script lang="ts">
	import { Heading, Hr, A, Button, Popover } from 'flowbite-svelte';
	import { ObjectsColumnOutline } from 'flowbite-svelte-icons';

	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import { formatSchoolNamesShort, orderByName, orderBySchoolNames } from '$lib/utils/programUtils';

	export let data;
</script>

<Heading tag="h1" class="page-title">Program Collections</Heading>

<Hr />

<article class="max-w-prose rounded-lg text-gray-500 bg-stone-50 p-6 mb-8 flex flex-col gap-4">
	<span>
		A collection is a way of aggregating application statistics from a set of related programs, and
		what counts as related is up to <i>you</i>.
	</span>
	<Button outline href={`/collection/new`} class="w-fit">Create a collection</Button>
</article>

{#await data.collections}
	<FetchingDataSign divClass="mb-8" />
{:then collections}
	<div class="flex flex-col gap-3 mb-8">
		{#each collections
			.filter((c) => c.is_public || c.creator_name === data.username)
			.sort((a, b) => a.name.localeCompare(b.name)) as collection}
			<div class="w-fit flex items-center gap-1">
				<A href={`/collection/${collection.id}`}>
					<ObjectsColumnOutline class="size-5 me-2 text-primary-500" />
					<span class="text-gray-900 font-medium">{collection.name}</span>
				</A>
			</div>
			<Popover class="p-3 w-[360px]">
				<Heading tag="h3" class="text-xl tracking-wide font-bold mb-1">{collection.name}</Heading>
				<div class="text-sm mb-4">Created by {collection.creator_name}</div>

				<div class="flex flex-col gap-2 text-sm">
					{#each collection.programs.sort(orderByName).sort(orderBySchoolNames) as program}
						<LinkWithIcon
							href={`/program/${program.id}`}
							text={`${formatSchoolNamesShort(program)} | ${program.display_name}`}
							iconFirst={true}
							spanClass={program.is_defunct ? 'text-gray-400' : ''}
						/>
					{/each}
				</div>
			</Popover>
		{/each}
	</div>
{/await}

<script lang="ts">
	import { Heading, Hr, A, Button, Popover } from 'flowbite-svelte';
	import { EyeSlashOutline, ObjectsColumnOutline } from 'flowbite-svelte-icons';

	import LinkWithIcon from '$lib/components/infobox/LinkWithIcon.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import { formatSchoolNamesShort, orderByName, orderBySchoolNames } from '$lib/utils/programUtils';

	export let data;
</script>

<Heading tag="h1" class="page-title">Program Collections</Heading>

<Hr />

<article
	class="max-w-prose rounded-lg text-gray-500 bg-stone-50 p-6 mb-12 flex flex-col gap-8 text-sm"
>
	<div>
		A <strong>program collection</strong> allows you to aggregate application statistics from any number
		of programs. Just create a collection and include the programs &mdash; any programs &mdash; that
		you&rsquo;re interested in.
	</div>
	<Button outline href={`/collection/new`} class="w-fit">Create a collection</Button>
</article>

{#await data.collections}
	<FetchingDataSign divClass="mb-8" />
{:then collections}
	<div class="grid grid-cols-2 gap-x-6 gap-y-4 max-w-3xl mb-8">
		{#each collections
			.filter((c) => c.is_public || c.creator_name === data.username)
			.sort((a, b) => a.name.localeCompare(b.name)) as collection}
			<div class="w-fit flex items-center gap-1 truncate">
				<A href={`/collection/${collection.id}`}>
					<ObjectsColumnOutline class="size-4 me-2 text-primary-700" />
					<span class="text-gray-900 font-medium text-sm">{collection.name}</span>
					{#if !collection.is_public}
						<EyeSlashOutline class="size-3 ms-2 text-gray-500" />
					{/if}
				</A>
			</div>

			<Popover class="p-3 w-[360px]">
				<Heading tag="h3" class="text-xl tracking-wide font-bold mb-1">{collection.name}</Heading>
				<div class="text-sm mb-4">Created by {collection.creator_name}</div>

				<div class="flex flex-col gap-2 text-sm">
					{#each collection.programs
						.sort(orderByName)
						.sort(orderBySchoolNames)
						.slice(0, 5) as program}
						<LinkWithIcon
							href={`/program/${program.id}`}
							text={`${formatSchoolNamesShort(program)} | ${program.display_name}`}
							iconFirst={true}
							spanClass={program.is_defunct ? 'text-gray-400' : ''}
						/>
					{/each}
					{#if collection.programs.length > 5}
						<div>... and {collection.programs.length - 5} more</div>
					{/if}
				</div>
			</Popover>
		{/each}
	</div>
{/await}

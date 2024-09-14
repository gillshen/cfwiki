<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Heading,
		Hr,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import { AwardOutline } from 'flowbite-svelte-icons';

	import type { SchoolRankingEntry } from '$lib/api/ranking';
	import DeleteButton from '$lib/components/buttons/DeleteButton.svelte';
	import UpdateButton from '$lib/components/buttons/UpdateButton.svelte';
	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import RankingEntryForm from '$lib/components/ranking-entry-form/RankingEntryForm.svelte';
	import DeleteForm from '$lib/components/delete-form/DeleteForm.svelte';
	import DeleteMessage from '$lib/components/delete-form/DeleteMessage.svelte';

	export let data;

	let entryModal = false;
	let entryDeleteModal = false;
	let activeEntry: SchoolRankingEntry | null = null;

	const orderByRankName = (a: SchoolRankingEntry, b: SchoolRankingEntry): number => {
		if (a.rank === b.rank) {
			return a.school.name.localeCompare(b.school.name);
		}
		return a.rank - b.rank;
	};
</script>

<Heading tag="h1" class="alt-page-title flex items-center gap-4">
	<AwardOutline size="xl" />
	{data.ranking.name}
	{data.year}
</Heading>

<Hr />

<Breadcrumb>
	<BreadcrumbLink text="Rankings" href="/ranking/index" />
	<BreadcrumbItem>{data.ranking.name} {data.year}</BreadcrumbItem>
</Breadcrumb>

{#await data.rankingEntries}
	<FetchingDataSign divClass="mt-8" />
{:then rankingEntries}
	<Table divClass="max-w-2xl mt-8" hoverable={rankingEntries.length > 1}>
		<TableHead>
			<TableHeadCell>School</TableHeadCell>
			<TableHeadCell class="text-right">Rank</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody>
			{#each rankingEntries.sort(orderByRankName) as entry}
				<TableBodyRow>
					<TableBodyCell class="font-normal w-[360px] truncate">
						<a href={`/school/${entry.school.id}`} class="hover:underline hover:text-primary-700">
							{entry.school.name}
						</a>
					</TableBodyCell>

					<TableBodyCell class="text-right w-8 tabular-nums">{entry.rank}</TableBodyCell>

					<TableBodyCell>
						<div class="flex gap-4 items-baseline justify-end">
							<UpdateButton
								onClick={() => {
									activeEntry = entry;
									entryModal = true;
								}}
							/>
							<DeleteButton
								onClick={() => {
									activeEntry = entry;
									entryDeleteModal = true;
								}}
							/>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/await}

<Button
	outline
	class="w-fit mt-8"
	on:click={() => {
		activeEntry = null;
		entryModal = true;
	}}
>
	Add an entry
</Button>

<FormModal
	open={entryModal}
	superform={data.rankingEntryForm}
	fields={RankingEntryForm}
	action="?/createOrUpdateRankingEntry"
	entity={activeEntry}
	title={`${activeEntry ? 'Update' : 'Create a'} ranking entry`}
	schools={data.schools}
	ranking={data.ranking}
	year={data.year}
	on:close={() => (entryModal = false)}
/>

<FormModal
	open={entryDeleteModal}
	superform={data.deleteForm}
	fields={DeleteForm}
	entity={activeEntry}
	action="?/deleteRankingEntry"
	title="Delete ranking entry"
	on:close={() => (entryDeleteModal = false)}
>
	<DeleteMessage slot="preface" name="this ranking entry" />
</FormModal>

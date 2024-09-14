<script lang="ts">
	import { A, Card, Heading, Hr } from 'flowbite-svelte';
	import { AwardOutline, PlusOutline } from 'flowbite-svelte-icons';

	import type { SchoolRanking } from '$lib/api/ranking';
	import Button from '$lib/components/buttons/Button.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import RankingEntryForm from '$lib/components/ranking-entry-form/RankingEntryForm.svelte';

	export let data;

	let newEntryModal = false;
	let activeRanking: SchoolRanking | null = null;
</script>

<Heading tag="h1" class="page-title">School Rankings</Heading>

<Hr />

{#await data.rankings}
	<FetchingDataSign />
{:then rankings}
	<article class="flex flex-wrap gap-8">
		{#each rankings as ranking}
			<Card>
				<Heading tag="h2" class="text-lg font-medium flex items-center">
					<AwardOutline class="me-1" />{ranking.name}
				</Heading>

				<div class="mt-4 h-full flex flex-col justify-between">
					<ul class="grid grid-cols-4 gap-x-6 gap-y-3">
						{#each ranking.editions.sort((a, b) => b - a) as edition}
							<li class="list-disc list-inside text-gray-400">
								<A href={`/ranking/${ranking.id}/${edition}`}>{edition}</A>
							</li>
						{/each}
					</ul>

					<div class="mt-8 flex gap-4 items-baseline">
						<Button
							onClick={() => {
								activeRanking = ranking;
								newEntryModal = true;
							}}
							text="New Edition"
							icon={PlusOutline}
						/>
					</div>
				</div>
			</Card>
		{/each}
	</article>
{/await}

<FormModal
	open={newEntryModal}
	superform={data.newEntryForm}
	fields={RankingEntryForm}
	action="?/createOrUpdateRankingEntry"
	title="Create a new edition"
	schools={data.schools}
	ranking={activeRanking}
	on:close={() => (newEntryModal = false)}
/>

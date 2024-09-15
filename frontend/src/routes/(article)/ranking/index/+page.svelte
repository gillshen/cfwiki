<script lang="ts">
	import { A, Card, Heading, Hr } from 'flowbite-svelte';
	import { AwardOutline, PlusOutline } from 'flowbite-svelte-icons';

	import { recognizedRankings } from '$lib/api/ranking';
	import Button from '$lib/components/buttons/Button.svelte';
	import FetchingDataSign from '$lib/components/misc/FetchingDataSign.svelte';
	import FormModal from '$lib/components/form-modal/FormModal.svelte';
	import RankingForm from '$lib/components/ranking-forms/RankingForm.svelte';

	export let data;

	let rankingModal = false;
	let activeRankingName: string | null = null;
</script>

<Heading tag="h1" class="page-title">School Rankings</Heading>

<Hr />

{#await data.rankings}
	<FetchingDataSign />
{:then rankings}
	<article class="flex flex-wrap gap-8">
		{#each Array.from(recognizedRankings) as rankingName}
			<Card>
				<Heading tag="h2" class="text-lg font-medium flex items-center">
					<AwardOutline class="me-1" />{rankingName}
				</Heading>

				<div class="mt-4 h-full flex flex-col justify-between">
					<ul class="grid grid-cols-4 gap-x-6 gap-y-3">
						{#each rankings
							.filter((ranking) => ranking.name === rankingName)
							.sort((a, b) => b.year - a.year) as ranking}
							<li class="list-disc list-inside text-gray-400">
								<A href={`/ranking/${ranking.id}`}>{ranking.year}</A>
							</li>
						{/each}
					</ul>

					<div class="mt-8 flex gap-4 items-baseline">
						<Button
							onClick={() => {
								activeRankingName = rankingName;
								rankingModal = true;
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
	open={rankingModal}
	superform={data.newRankingForm}
	fields={RankingForm}
	action="?/createSchoolRanking"
	title="Create a new edition"
	name={activeRankingName}
	on:close={() => (rankingModal = false)}
/>

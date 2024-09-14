<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	import type { School } from '$lib/api/school';
	import countryFlags from '$lib/constants/countryFlags';
	import { formatLocation, formatRanking, getLatestRanking } from '$lib/utils/schoolUtils';

	export let school: School;

	$: usNewsRank = formatRanking(getLatestRanking(school, { rankingName: 'US News' }), {
		year: true
	});

	$: qsRank = formatRanking(getLatestRanking(school, { rankingName: 'QS World' }), { year: true });
</script>

<Table>
	<TableBody>
		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Alt. name</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{school.alt_name || '-'}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Type</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">{school.type}</TableBodyCell>
		</TableBodyRow>

		<TableBodyRow>
			<TableBodyCell tdClass="w-40 font-medium py-4">Location</TableBodyCell>
			<TableBodyCell tdClass="font-normal py-4">
				<div class="flex gap-2">
					<div>{countryFlags[school.country]}</div>
					<div>{formatLocation(school)}</div>
				</div>
			</TableBodyCell>
		</TableBodyRow>

		{#if school.type === 'University'}
			<TableBodyRow>
				<TableBodyCell tdClass="w-40 font-medium py-4">US News Rank</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-4">
					{usNewsRank ? `#\u2009${usNewsRank}` : '-'}
				</TableBodyCell>
			</TableBodyRow>

			<TableBodyRow>
				<TableBodyCell tdClass="w-40 font-medium py-4">QS Rank</TableBodyCell>
				<TableBodyCell tdClass="font-normal py-4">
					{qsRank ? `#\u2009${qsRank}` : '-'}
				</TableBodyCell>
			</TableBodyRow>
		{/if}
	</TableBody>
</Table>

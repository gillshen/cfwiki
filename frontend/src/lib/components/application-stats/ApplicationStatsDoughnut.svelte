<script lang="ts">
	import { onMount } from 'svelte';

	import {
		Card,
		Heading,
		P,
		A,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Tooltip
	} from 'flowbite-svelte';

	import { QuestionCircleOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import Chart from 'chart.js/auto';

	import type { ApplicationStats } from '$lib/api/stats';
	import NoDataSign from '$lib/components/misc/NoDataSign.svelte';
	import { getSuccessRateAsPercentage } from '$lib/utils/numUtils';

	export let stats: ApplicationStats;
	export let title: string = 'Application Statistics';
	export let href: string = '';

	let statsChart: any;

	const chartData = {
		labels: ['Pending', 'Accepted', 'Denied', 'Cancelled, etc.'],
		datasets: [
			{
				data: [stats.pending, stats.accepted, stats.denied, stats.neutral],

				// use the leading space to create some padding
				label: ' number',
				// amber-400, green-400, rose-400, gray-400
				backgroundColor: ['#fbbf24', '#4ade80', '#fb7185', '#9ca3af'],
				// amber-500, green-500, rose-500, gray-500
				hoverBackgroundColor: ['#f59e0b', '#22c55e', '#f43f5e', '#6b7280'],
				// for creating a little interactiveness
				hoverOffset: 2
			}
		]
	};

	const chartOptions = {
		responsive: false
	};

	const tableRows = [
		['Pending', stats.pending],
		['Accepted', stats.accepted],
		['Denied', stats.denied],
		['Cancelled, etc.', stats.neutral]
	];

	onMount(() => {
		if (!stats.applied) {
			return;
		}

		const chartContext = statsChart.getContext('2d');

		// place the legends on the right
		Chart.overrides['doughnut'].plugins.legend.position = 'right';

		new Chart(chartContext, {
			type: 'doughnut',
			data: chartData,
			options: chartOptions
		});
	});
</script>

<Heading tag="h2" class="section-title flex-title flex items-center justify-between">
	<span class="section-title">{title}</span>
	{#if href && stats.applied}
		<A {href} class="text-sm font-normal section-title !text-primary-700">
			More Stats<ArrowRightOutline class="ms-1" />
		</A>
	{/if}
</Heading>

{#if stats.applied}
	<canvas bind:this={statsChart} width="360" height="280" />

	<div class="grid grid-cols-2 gap-8">
		<Card>
			<P size="4xl" weight="medium">{stats.applied}</P>
			<P size="sm">application{stats.applied > 1 ? 's' : ''}</P>
			<hr class="mt-6 mb-4" />
			<div class="flex items-baseline gap-1">
				{#if stats.accepted + stats.denied}
					<P size="4xl" weight="medium">{getSuccessRateAsPercentage(stats)}</P>
					<P size="xl" weight="medium">%</P>
				{:else}
					<P size="4xl" weight="medium" color="text-gray-400">N/A</P>
				{/if}
			</div>
			<div class="flex items-center">
				<P size="sm">acceptance rate</P>
				<QuestionCircleOutline size="sm" class="ms-1" />
				<Tooltip class="tooltip" placement="right">accepted / (accepted + denied)</Tooltip>
			</div>
		</Card>

		<Table divClass="mr-4">
			<TableBody>
				{#each tableRows as [key, value]}
					<TableBodyRow color="custom">
						<TableBodyCell class="pl-0">{key}</TableBodyCell>
						<TableBodyCell class="font-normal text-right pr-0 tabular-nums">
							{value}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
{:else}
	<NoDataSign text="Not available" divClass="mt-6" />
{/if}

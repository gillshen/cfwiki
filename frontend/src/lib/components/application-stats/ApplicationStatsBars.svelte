<script lang="ts">
	import { onMount } from 'svelte';

	import {
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';

	import { QuestionCircleOutline } from 'flowbite-svelte-icons';
	import Chart from 'chart.js/auto';

	import type { ApplicationStats } from '$lib/api/stats';
	import { getSuccessRateAsPercentage } from '$lib/utils/numUtils';

	export let aggregatedData: Record<string, ApplicationStats>;
	export let title: string = 'Application Statistics';

	const labels = Object.keys(aggregatedData).sort();
	const pendingData = labels.map((key) => aggregatedData[key].pending);
	const acceptedData = labels.map((key) => aggregatedData[key].accepted);
	const deniedData = labels.map((key) => aggregatedData[key].denied);
	const neutralData = labels.map((key) => aggregatedData[key].neutral);

	let statsChart: any;
	const chartWidth = Math.max(500, 200 * labels.length);

	const stacked = false;
	const barPercentage = 0.8;
	const maxBarThickness = 48;

	const formatLabel = (label: string): string => {
		switch (label) {
			case 'female':
				return 'Female';
			case 'male':
				return 'Male';
			case 'other':
				return 'Other';
			default:
				return label;
		}
	};

	const chartData = {
		labels: labels.map((label) => formatLabel(label)),
		datasets: [
			{
				label: 'Pending',
				data: pendingData,
				backgroundColor: 'rgba(251, 191, 36, 0.8)',
				barPercentage,
				maxBarThickness
			},
			{
				label: 'Accepted',
				data: acceptedData,
				backgroundColor: 'rgba(74, 222, 128, 0.8)',
				barPercentage,
				maxBarThickness
			},
			{
				label: 'Denied',
				data: deniedData,
				backgroundColor: 'rgba(251, 113, 133, 0.8)',
				barPercentage,
				maxBarThickness
			},
			{
				label: 'Cancelled, etc.',
				data: neutralData,
				backgroundColor: 'rgba(156, 163, 175, 0.8)',
				barPercentage,
				maxBarThickness
			}
		]
	};

	$: chartOptions = {
		responsive: false,

		scales: {
			x: {
				stacked,
				grid: {
					display: false // remove grid lines on the x-axis
				}
			},
			y: {
				stacked,
				beginAtZero: true,
				grace: 2,
				grid: {
					display: false // remove grid lines on the y-axis
				}
			}
		}
	};

	onMount(() => {
		const chartContext = statsChart.getContext('2d');

		new Chart(chartContext, {
			type: 'bar',
			data: chartData,
			options: chartOptions
		});
	});
</script>

<Heading tag="h2" class="section-title flex-title mb-4">
	{title}
</Heading>

<canvas bind:this={statsChart} width={chartWidth} height="360" />

<Table divClass="max-w-[600px] w-[360px] mt-4 ml-3">
	<TableHead>
		<TableHeadCell class="pl-0">Sub-group</TableHeadCell>
		<TableHeadCell class="text-right">Total</TableHeadCell>

		<TableHeadCell class="w-full pr-0 flex justify-end">
			<div class="flex items-center">
				Acceptance rate
				<QuestionCircleOutline size="sm" class="ms-1" />
				<Tooltip class="tooltip lowercase" placement="right">accepted / (accepted + denied)</Tooltip
				>
			</div>
		</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each labels as label}
			{@const total = aggregatedData[label].applied}
			{@const successRate = getSuccessRateAsPercentage(aggregatedData[label])}
			<TableBodyRow color="custom">
				<TableBodyCell class="pl-0 py-3">{formatLabel(label)}</TableBodyCell>
				<TableBodyCell class="py-3 font-normal text-right tabular-nums">{total}</TableBodyCell>

				<TableBodyCell class="py-3 font-normal text-right tabular-nums pr-0">
					{successRate === null ? '-' : `${successRate}\u2009%`}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

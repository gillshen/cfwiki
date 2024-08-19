<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import { toShortYearMonth } from '$lib/utils/dateUtils';

	export let date: string | null;
</script>

<TableBodyCell class="font-normal">{toShortYearMonth(date) || '-'}</TableBodyCell>

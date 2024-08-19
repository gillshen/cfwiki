<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let date: string | null;
</script>

<TableBodyCell class="font-normal">{toShortDate(date) || '-'}</TableBodyCell>

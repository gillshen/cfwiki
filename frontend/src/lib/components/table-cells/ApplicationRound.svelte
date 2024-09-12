<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ComposedApplication } from '$lib/api/application';

	export let application: ComposedApplication;
</script>

<TableBodyCell class="font-normal max-w-16">{application.round_name}</TableBodyCell>

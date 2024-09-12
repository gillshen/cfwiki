<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';

	import type { ComposedApplication } from '$lib/api/application';
	import ApplicationStatusCell from '$lib/components/misc/ApplicationStatusCell.svelte';

	export let application: ComposedApplication;
</script>

<TableBodyCell><ApplicationStatusCell {application} /></TableBodyCell>

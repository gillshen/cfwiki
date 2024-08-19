<script lang="ts">
	import { TableBodyCell, A } from 'flowbite-svelte';
	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
</script>

<TableBodyCell class="max-w-20 font-normal">{application.student.fullname}</TableBodyCell>

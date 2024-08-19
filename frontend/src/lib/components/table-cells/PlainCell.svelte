<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	export let text: any;
</script>

<TableBodyCell class="font-normal">{text || '-'}</TableBodyCell>

<script lang="ts">
	import { P } from 'flowbite-svelte';

	export let name: string;
</script>

<div class="flex flex-col gap-2 mt-4">
	<P size="sm" color="text-gray-600">
		You are about to permanently delete {name} from the database. This action
		<strong>cannot be undone</strong>.
	</P>
	<P size="sm" color="text-gray-600">Are you sure you want to proceed?</P>
</div>

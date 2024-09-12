<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { CogOutline } from 'flowbite-svelte-icons';

	export let hideControl: Writable<boolean>;
</script>

<button class="text-primary-700 relative -top-1.5 -left-2" on:click={() => hideControl.set(false)}>
	<CogOutline />
</button>

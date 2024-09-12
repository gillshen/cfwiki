<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { CogOutline } from 'flowbite-svelte-icons';
	import Button from '$lib/components/buttons/Button.svelte';

	export let hideControl: Writable<boolean>;
</script>

<Button onClick={() => hideControl.set(false)} text="Show/Hide Columns" icon={CogOutline} />

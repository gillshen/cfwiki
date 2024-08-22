<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	export let entity: { id: number };
	export let path: string;
</script>

<A class="translate-y-1.5" href={`${path}/${entity.id}`}><LinkOutline /></A>

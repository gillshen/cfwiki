<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';
	import type { ApplicationListItem } from '$lib/api/application';

	export let application: ApplicationListItem;
</script>

<A class="translate-y-1.5" href={`/application/${application.id}`}><LinkOutline /></A>

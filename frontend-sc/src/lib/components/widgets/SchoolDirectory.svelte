<script lang="ts">
	import type { School } from '$lib/api/school';
	import LoadingSign from '$lib/components/misc/LoadingSign.svelte';
	import { orderByName } from '$lib/util/schoolUtils';

	export let schools: Promise<School[]>;
	export let type: 'University' | 'Secondary School' | 'Other';
</script>

{#await schools}
	<LoadingSign />
{:then schools}
	<div class="grid grid-cols-2 gap-2">
		{#each schools.filter((s) => s.type === type).sort(orderByName) as school}
			<a href={`/school/${school.id}`}>{school.name}</a>
		{/each}
	</div>
{/await}

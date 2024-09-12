<script lang="ts">
	import { TableBodyCell } from 'flowbite-svelte';
	import type { ComposedApplication } from '$lib/api/application';
	import countryFlags from '$lib/constants/countryFlags';

	export let application: ComposedApplication;
</script>

<TableBodyCell class={`max-w-[16rem] truncate`}>
	{application.schools
		.map((s) => `${countryFlags[s.country]}\xa0\xa0${s.name}`)
		.join('\xa0\xa0+\xa0\xa0')}
</TableBodyCell>

<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	export let years: number[];
	export let domain: 'students' | 'applications';
</script>

{#each years as year}
	{@const path = `/data/${domain}/${year}`}
	<Heading tag="h4" class="mt-3 text-sm font-medium text-primary-900">{year}</Heading>
	<ul>
		<li><a href={`${path}/freshman`} target="_self">UG Freshman</a></li>
		<li><a href={`${path}/transfer`} target="_self">UG Transfer</a></li>
		<li class="flex gap-1 items-baseline">
			<a href={`${path}/graduate`} target="_self">Graduate</a>
			<span>|</span>
			<a href={`${path}/other`} target="_self">Other</a>
		</li>
	</ul>
{/each}

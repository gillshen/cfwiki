<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	export let years: number[];
	export let domain: 'students' | 'applications';
</script>

{#each years as year}
	<Heading tag="h4" class="mt-3 text-sm font-medium text-primary-900">{year}</Heading>
	<ul>
		<li><a href={`/data/${domain}/${year}/freshman`}>UG Freshman</a></li>
		<li><a href={`/data/${domain}/${year}/transfer`}>UG Freshman</a></li>
		<li class="flex gap-1 items-baseline">
			<a href={`/data/${domain}/${year}/graduate`}>Graduate</a>
			<span>|</span>
			<a href={`/data/${domain}/${year}/graduate`}>Other</a>
		</li>
	</ul>
{/each}

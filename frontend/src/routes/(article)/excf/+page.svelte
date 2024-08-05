<script lang="ts">
	import LinkWithIcon from '$lib/components/links/LinkWithIcon.svelte';
	import { Heading, Hr, A, P } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	export let data;

	const exUsers = data.exUsers.sort((a, b) => a.username.localeCompare(b.username));
</script>

<Heading tag="h1" class="page-title">Former CF People</Heading>

<Hr />

<div class="mt-2">
	<ul class="w-[36rem] grid grid-cols-3 gap-x-8 gap-y-4">
		{#each exUsers as exUser}
			<li class="w-fit">
				<LinkWithIcon href={`/cf/${exUser.username}`} text={exUser.username} size="base" />
			</li>
		{/each}
	</ul>
</div>

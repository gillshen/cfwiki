<script lang="ts">
	import { Heading, Hr, A, P } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	export let data;

	const exUsers = data.exUsers.sort((a, b) => a.username.localeCompare(b.username));
</script>

<Heading tag="h1" class="page-title">Former CF People</Heading>

<Hr />

<div class="mt-2">
	<ul class="flex flex-col gap-2">
		{#each exUsers as exUser}
			<li class="w-fit">
				<A href={`/cf/${exUser.username}`} class="flex gap-1">
					<P>{exUser.username}</P>
					<ArrowUpRightFromSquareOutline class="w-4 h-4" />
				</A>
			</li>
		{/each}
	</ul>
</div>

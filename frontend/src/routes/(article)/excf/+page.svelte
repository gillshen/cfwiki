<script lang="ts">
	import { Heading, Hr, A } from 'flowbite-svelte';
	import { PenNibOutline, PhoneOutline, UserCircleOutline } from 'flowbite-svelte-icons';

	export let data;
</script>

<Heading tag="h1" class="page-title">Ex-CFers</Heading>

<Hr />

<ul class="mt-2 w-[36rem] grid grid-cols-4 gap-x-8 gap-y-4">
	{#each data.exUsers.sort((a, b) => a.username.localeCompare(b.username)) as exUser}
		<li class="w-fit">
			<A href={`/cf/${exUser.username}`}>
				{#if exUser.department === '文案'}
					<PenNibOutline class="size-5 me-2 text-primary-500" />
				{:else if exUser.department === '咨询'}
					<PhoneOutline class="size-5 me-2 text-primary-500" />
				{:else}
					<UserCircleOutline class="size-5 me-2 text-primary-500" />
				{/if}
				<span class="text-gray-900 font-medium">{exUser.username}</span>
			</A>
		</li>
	{/each}
</ul>

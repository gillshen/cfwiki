<script lang="ts">
	import { Heading, Hr, A } from 'flowbite-svelte';
	import { PenNibOutline, PhoneOutline, UserCircleOutline } from 'flowbite-svelte-icons';

	import type { CfUserListItem } from '$lib/api/user';

	export let users: CfUserListItem[];
	export let title: string;
</script>

<Heading tag="h1" class="page-title">{title}</Heading>

<Hr />

<ul class="mt-2 w-[36rem] grid grid-cols-4 gap-x-8 gap-y-4">
	{#each users.sort((a, b) => a.username.localeCompare(b.username)) as user}
		<li class="w-fit">
			<A href={`/cf/${user.username}`}>
				{#if user.department === '文案'}
					<PenNibOutline class="size-4 me-1" />
				{:else if user.department === '咨询'}
					<PhoneOutline class="size-4 me-1 text-stone-500" />
				{:else}
					<UserCircleOutline class="size-4 me-1 text-stone-500" />
				{/if}
				<span class="text-gray-900 text-sm">{user.username}</span>
			</A>
		</li>
	{/each}
</ul>

<slot />

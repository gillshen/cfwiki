<script lang="ts">
	import DropdownMenuItem from '$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte';
	import UserAvatar from '$lib/components/misc/UserAvatar.svelte';
	import type { CfUserListItem } from '$lib/api/user';
	import { filterSortCfUsers } from '$lib/util/userUtils';

	export let users: CfUserListItem[];
	export let department: '文案' | '咨询';
</script>

<div class="grid grid-cols-2 gap-x-6">
	{#each filterSortCfUsers({ users, department, employmentStatus: 'current' }) as { username }}
		<DropdownMenuItem href="/cf/{username}" class="text-inherit hover:no-underline">
			<UserAvatar {username} class="size-6 bg-transparent" imageClass="size-4" />
			{username}
		</DropdownMenuItem>
	{/each}
</div>

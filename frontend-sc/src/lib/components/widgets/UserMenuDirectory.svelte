<script lang="ts">
	import { cn } from '$lib/utils';
	import DropdownMenuItem from '$lib/components/ui/dropdown-menu/dropdown-menu-item.svelte';
	import type { CfUserListItem } from '$lib/api/user';
	import { filterSortCfUsers } from '$lib/util/userUtils';

	export let users: CfUserListItem[];
	export let department: '文案' | '咨询';
	export let itemClass: string = '';
</script>

{#each filterSortCfUsers({ users, department, employmentStatus: 'current' }) as { username }}
	<DropdownMenuItem href="/cf/{username}" class={cn('text-inherit hover:no-underline', itemClass)}>
		<div
			class={// for better visual alignment
			username[0] === 'J' ? '-translate-x-[1.5px]' : ''}
		>
			{username}
		</div>
	</DropdownMenuItem>
{/each}

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { CfUserListItem } from '$lib/api/user';
	import { filterSortCfUsers } from '$lib/util/userUtils';

	export let users: CfUserListItem[];
	export let department: '文案' | '咨询';
	export let employmentStatus: 'current' | 'past' = 'current';
	export let hrefClass: string = '';
</script>

<div class="grid grid-cols-3 gap-x-6 gap-y-2 min-w-[400px]">
	{#each filterSortCfUsers({ users, department, employmentStatus }) as { username }}
		<a
			href="/cf/{username}"
			class={cn(
				'w-fit',
				// for better visual alignment
				username[0] === 'J' ? '-translate-x-[1.5px]' : '',
				hrefClass
			)}>{username}</a
		>
	{/each}
</div>

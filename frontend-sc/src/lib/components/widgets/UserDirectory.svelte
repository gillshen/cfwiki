<script lang="ts">
	import type { CfUserListItem } from '$lib/api/user';
	import { filterSortCfUsers } from '$lib/util/userUtils';
	import { cn } from '$lib/utils';

	export let users: CfUserListItem[];
	export let department: '文案' | '咨询';
	export let employmentStatus: 'current' | 'past' = 'current';
	export let hrefClass: string = '';
</script>

<div class="grid grid-cols-2 gap-x-4 gap-y-2">
	{#each filterSortCfUsers({ users, department, employmentStatus }) as { username }}
		<a
			href={`/cf/${username}`}
			class={cn(
				'w-fit',
				// for better visual alignment
				username[0] === 'J' ? '-translate-x-[1.5px]' : '',
				hrefClass
			)}>{username}</a
		>
	{/each}
</div>

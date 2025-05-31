<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import type { CfUserListItem } from '$lib/api/user';

	export let username: string;
	export let className: string = '';
	export let imageClass: string = '';
	export { className as class };

	const findAvatar = (username: string): string | undefined =>
		$page.data.cfUsers.find((user: CfUserListItem) => user.username === username)?.avatar;
</script>

<Avatar.Root class={cn('flex bg-muted border', className)}>
	<Avatar.Image
		src={findAvatar(username)}
		class={cn('size-7 m-auto', imageClass)}
		alt="{username}-avatar"
	/>
	<Avatar.Fallback>{username[0].toUpperCase()}</Avatar.Fallback>
</Avatar.Root>

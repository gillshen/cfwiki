<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	import UserIndexPage from '$lib/components/user-index-page/UserIndexPage.svelte';

	export let data;

	const exUsers = data.cfUsers.filter((user) => !user.is_active);
</script>

<UserIndexPage users={exUsers} title="Ex-CFers">
	<div class="mt-12">
		<A href="/cf/index" class="text-xs uppercase tracking-wide font-normal">
			Current CFers<ArrowRightOutline class="ms-1 size-4" />
		</A>
	</div>
</UserIndexPage>

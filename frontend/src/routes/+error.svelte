<script lang="ts">
	import { page } from '$app/stores';
	import { A } from 'flowbite-svelte';
	import ErrorPage from '$lib/components/error-page/ErrorPage.svelte';
</script>

<div class="flex h-[calc(100vh-10rem)]">
	<ErrorPage status={$page.status} message={$page.error?.message}>
		<A href="/home">Go back to the homepage</A>
	</ErrorPage>
</div>

<script lang="ts">
	import { page } from '$app/stores';
	import { A } from 'flowbite-svelte';
	import ErrorPage from '$lib/components/error-page/ErrorPage.svelte';
</script>

<ErrorPage status={$page.status} message={$page.error?.message}>
	<A href="/ranking/index">Maybe look here</A>
</ErrorPage>

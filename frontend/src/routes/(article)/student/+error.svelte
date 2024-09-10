<script lang="ts">
	import { page } from '$app/stores';
	import { A } from 'flowbite-svelte';
	import ErrorPage from '$lib/components/error-page/ErrorPage.svelte';
</script>

<ErrorPage status={$page.status} message={$page.error?.message}>
	<A href="/home">Go back to the homepage</A> or <A href="/data/students">search the data grid</A>
</ErrorPage>

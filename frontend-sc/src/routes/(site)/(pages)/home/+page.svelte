<script lang="ts">
	import UserPage from '$lib/components/widgets/UserPage.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle('Home')}</title>
</svelte:head>

<UserPage host={data.host} students={data.students} applications={data.applications} />

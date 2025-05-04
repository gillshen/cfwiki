<script lang="ts">
	import UserPage from '$lib/components/widgets/UserPage.svelte';
	import { createTitle } from '$lib/util/siteUtils';

	export let data;
</script>

<svelte:head>
	<title>{createTitle(data.host.username)}</title>
</svelte:head>

<UserPage user={data.host} students={data.hostStudents} applications={data.hostApplications} />

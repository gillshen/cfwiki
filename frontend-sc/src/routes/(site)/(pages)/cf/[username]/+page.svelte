<script lang="ts">
	import UserPage from '$lib/components/widgets/UserPage.svelte';

	export let data;
</script>

<UserPage host={data.host} students={data.hostStudents} applications={data.hostApplications} />

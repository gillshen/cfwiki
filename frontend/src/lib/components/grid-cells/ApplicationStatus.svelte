<script lang="ts">
	import type { ComposedApplication } from '$lib/api/application';
	import ApplicationStatusCell from '$lib/components/misc/ApplicationStatusCell.svelte';

	export let application: ComposedApplication;
</script>

<ApplicationStatusCell {application} />

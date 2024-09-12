<script lang="ts">
	import type { ComposedApplication } from '$lib/api/application';
	import Program from '$lib/components/table-cells/Program.svelte';
	import MajorsOrTrack from '$lib/components/table-cells/MajorsOrTrack.svelte';
	import { isUndergraduate } from '$lib/utils/programUtils';

	export let application: ComposedApplication;
</script>

{#if isUndergraduate(application.program)}
	<MajorsOrTrack {application} />
{:else}
	<Program {application} />
{/if}

<script lang="ts">
	import type { ApplicationListItem } from '$lib/api/application';
	import Program from '$lib/components/table-cells/Program.svelte';
	import Majors from '$lib/components/table-cells/Majors.svelte';
	import { isUndergraduate } from '$lib/utils/programUtils';

	export let application: ApplicationListItem;
	export let maxWidth: string = '12rem';
</script>

{#if isUndergraduate(application.program)}
	<Majors {application} {maxWidth} />
{:else}
	<Program {application} {maxWidth} />
{/if}

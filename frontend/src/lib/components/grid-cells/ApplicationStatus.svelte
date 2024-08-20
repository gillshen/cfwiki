<script lang="ts">
	import type { ApplicationListItem } from '$lib/api/application';
	import { statusToClass } from '$lib/utils/applicationUtils';

	export let application: ApplicationListItem;
	const status = application.latest_log?.status;
</script>

{#if status}
	<span class={`font-medium status-${statusToClass(status)}`}>{status}</span>
{/if}

<script lang="ts">
	import type { ApplicationListItem } from '$lib/api/application';
	import { statusToClass } from '$lib/utils/applicationUtils';

	export let application: ApplicationListItem;
</script>

{#if application.l_status}
	<span class={`font-medium status-${statusToClass(application.l_status)}`}>
		{application.l_status}
	</span>
{/if}

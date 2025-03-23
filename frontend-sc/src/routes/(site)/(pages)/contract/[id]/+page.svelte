<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';

	export let data;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>Contracts</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>This Contract (TODO)</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<pre class="text-sm p-4 rounded-lg bg-zinc-100">{JSON.stringify(data.contract, null, 2)}</pre>

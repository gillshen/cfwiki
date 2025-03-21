<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>Contracts</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>This Contract (TODO)</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

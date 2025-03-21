<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Link href="/program/index">Programs</Breadcrumb.Link>
	</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item>
		<Breadcrumb.Page>(TODO this program)</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

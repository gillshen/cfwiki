<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';

	export let data;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Account</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<Section id="user-section" title={`Username: ${data.username}`}>
	<pre class="bg-gray-100 p-4 rounded-md text-sm">{JSON.stringify(data.user, null, 2)}</pre>
</Section>

<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import SchoolDirectory from '$lib/components/widgets/SchoolDirectory.svelte';

	export let data;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Schools</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<Section id="universities" title="Universities">
	<SchoolDirectory schools={data.schools} type="University" />
</Section>

<Section id="secondary-schools" title="Secondary Schools">
	<SchoolDirectory schools={data.schools} type="Secondary School" />
</Section>

<Section id="other-institutions" title="Other Institutions">
	<SchoolDirectory schools={data.schools} type="Other" />
</Section>

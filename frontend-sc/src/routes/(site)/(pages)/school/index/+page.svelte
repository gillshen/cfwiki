<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import SchoolDirectory from '$lib/components/widgets/SchoolDirectory.svelte';
	import { scrollToHash } from '$lib/util/siteUtils';

	export let data;

	afterNavigate(scrollToHash);
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Schools</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<Section id="universities" title="Universities" class="scroll-mt-[64px]">
	<SchoolDirectory schools={data.schools} type="University" />
</Section>

<Section id="secondary-schools" title="Secondary Schools" class="scroll-mt-[64px]">
	<SchoolDirectory schools={data.schools} type="Secondary School" />
</Section>

<Section id="other-institutions" title="Other Institutions" class="scroll-mt-[64px]">
	<SchoolDirectory schools={data.schools} type="Other" />
</Section>

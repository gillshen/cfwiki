<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import UgProgramDirectory from '$lib/components/widgets/UGProgramDirectory.svelte';
	import NamedProgramDirectory from '$lib/components/widgets/NamedProgramDirectory.svelte';
	import { scrollToHash } from '$lib/util/siteUtils';

	export let data;

	afterNavigate(scrollToHash);
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Programs</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<Section id="ug-freshman" title="UG Freshman" class="scroll-mt-[64px]">
	<UgProgramDirectory programs={data.programs} type="UG Freshman" />
</Section>

<Section id="ug-transfer" title="UG Transfer" class="scroll-mt-[64px]">
	<UgProgramDirectory programs={data.programs} type="UG Transfer" />
</Section>

<Section id="masters" title="Master&rsquo;s" class="scroll-mt-[64px]">
	<NamedProgramDirectory programs={data.programs} type="Master's" />
</Section>

<Section id="doctorate" title="Doctorate" class="scroll-mt-[64px]">
	<NamedProgramDirectory programs={data.programs} type="Doctorate" />
</Section>

<Section id="non-degree" title="Non-degree" class="scroll-mt-[64px]">
	<NamedProgramDirectory programs={data.programs} type="Non-degree" />
</Section>

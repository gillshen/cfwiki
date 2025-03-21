<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
	import Section from '$lib/components/containers/Section.svelte';
	import UgProgramDirectory from '$lib/components/widgets/UGProgramDirectory.svelte';
	import NamedProgramDirectory from '$lib/components/widgets/NamedProgramDirectory.svelte';

	export let data;
</script>

<BreadcrumbContainer>
	<Breadcrumb.Item>
		<Breadcrumb.Page>Programs</Breadcrumb.Page>
	</Breadcrumb.Item>
</BreadcrumbContainer>

<Section id="ug-freshman" title="UG Freshman">
	<UgProgramDirectory programs={data.programs} type="UG Freshman" />
</Section>

<Section id="ug-transfer" title="UG Transfer">
	<UgProgramDirectory programs={data.programs} type="UG Transfer" />
</Section>

<Section id="masters" title="Master&rsquo;s">
	<NamedProgramDirectory programs={data.programs} type="Master's" />
</Section>

<Section id="doctorate" title="Doctorate">
	<NamedProgramDirectory programs={data.programs} type="Doctorate" />
</Section>

<Section id="non-degree" title="Non-degree">
	<NamedProgramDirectory programs={data.programs} type="Non-degree" />
</Section>

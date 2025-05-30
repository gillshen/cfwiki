<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import BreadcrumbContainer from '$lib/components/containers/BreadcrumbContainer.svelte';
</script>

<section class="ml-[240px] p-4 mb-8 flex items-start">
	<div
		class="w-[360px] shrink-0 sticky top-[76px] pl-4 pr-6 pb-4 mr-6 max-h-[calc(100vh-76px)] overflow-auto"
	>
		<BreadcrumbContainer class="static bg-transparent">
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/student/index">Students</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<slot name="breadcrumb" />
		</BreadcrumbContainer>

		<slot name="header" />
	</div>

	<div class="w-full">
		<slot />
	</div>
</section>

<slot name="footer" />

<script lang="ts">
	import { Breadcrumb, Heading, Hr } from 'flowbite-svelte';

	import BreadcrumbLink from '$lib/components/misc/BreadcrumbLink.svelte';

	export let backUrl: string;
	export let backUrlText: string;
</script>

<Heading tag="h1" class="alt-page-title flex items-center gap-4 text-gray-500">
	How Did You Get Here?
</Heading>

<Hr />

<Breadcrumb class="mb-8">
	<BreadcrumbLink text={backUrlText} href={backUrl} />
</Breadcrumb>

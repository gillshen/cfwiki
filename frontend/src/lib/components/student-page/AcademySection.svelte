<script lang="ts">
	import { Heading, A } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import AcademyProductItems from '$lib/components/list-items/AcademyProductItems.svelte';
	import NoDataSign from '../misc/NoDataSign.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean;
</script>

<Heading tag="h2" class="section-title">CF Academy</Heading>

{#if student.academy_products.length}
	<div class="flex flex-col gap-3 mt-6 text-sm">
		<AcademyProductItems products={student.academy_products} />
	</div>
{:else if !canEdit}
	<NoDataSign text="None" divClass="mt-6" />
{/if}

{#if canEdit}
	<A href={`/student/${student.id}/cf-academy`} class="mt-6">
		<span class="text-xs uppercase tracking-wide">Manage Participation</span>
		<ArrowRightOutline class="ms-0.5 size-4" />
	</A>
{/if}

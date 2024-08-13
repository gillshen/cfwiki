<script lang="ts">
	import { Heading, Badge, Button } from 'flowbite-svelte';
	import { CircleMinusOutline } from 'flowbite-svelte-icons';

	import type { StudentDetail } from '$lib/api/student';
	import type { ApplicationListItem } from '$lib/api/application';
	import StudentApplications from '$lib/components/tables/StudentApplications.svelte';

	export let student: StudentDetail;
	export let applications: ApplicationListItem[];
	export let canEdit: boolean = false;
</script>

<article class="mt-24 col-span-2">
	<Heading tag="h2" class="text-2xl font-bold flex items-center gap-2">
		Applications<Badge>{applications.length}</Badge>
	</Heading>

	{#if applications.length}
		<StudentApplications {applications} />
	{:else if !canEdit}
		<div class="mt-4 flex items-center gap-2 text-gray-400">
			<CircleMinusOutline /><span>No applications</span>
		</div>
	{/if}

	{#if canEdit}
		<Button outline href={`/student/${student.id}/new-application`} class="mt-8">
			Create an application
		</Button>
	{/if}
</article>

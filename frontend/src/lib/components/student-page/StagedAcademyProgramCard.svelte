<script lang="ts">
	import { Card, CloseButton } from 'flowbite-svelte';

	import type { AcademyProgramListItem } from '$lib/api/academyProgram';
	import AcademyProgramItem from '$lib/components/list-items/AcademyProgramItem.svelte';

	export let item: AcademyProgramListItem;
	export let onRemove: () => void = () => {};
</script>

<Card padding="md" size="lg">
	<div class="flex justify-between items-center w-full">
		<AcademyProgramItem program={item} spanClass="text-sm" />

		<div><CloseButton on:click={onRemove} /></div>
	</div>
</Card>

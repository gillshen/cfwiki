<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { LinkOutline } from 'flowbite-svelte-icons';

	import type { AcademyProgramListItem } from '$lib/api/academyProgram';
	import AcademyProgramItem from '$lib/components/list-items/AcademyProgramItem.svelte';
	import { orderByCategoryName } from '$lib/utils/academyProgramUtils';

	export let programs: AcademyProgramListItem[];
</script>

{#each programs.sort(orderByCategoryName) as program}
	<A href={`/cf-academy/program/${program.id}`} class="w-fit">
		<LinkOutline size="sm" class="me-2" />
		<AcademyProgramItem {program} spanClass="text-gray-900" />
	</A>
{/each}

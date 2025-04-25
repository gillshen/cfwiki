<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	import type { StudentOfCferListItem } from '$lib/api/student';

	export let students: StudentOfCferListItem[];
	export let year: string;
	export let selectedStudentId: number | undefined = undefined;
	export let open: boolean = true;
</script>

<Collapsible.Root {open}>
	<Collapsible.Trigger
		class="w-full text-sm flex items-center gap-1 text-muted-foreground hover:text-inherit"
	>
		{year}<ChevronDown class="size-4" />
	</Collapsible.Trigger>
	<Collapsible.Content>
		<div class="flex flex-col text-sm gap-2 pt-2">
			{#each students as student}
				{#if student.id === selectedStudentId}
					<div class="font-medium">{student.fullname}</div>
				{:else}
					<a href={`/student/${student.id}`}>{student.fullname}</a>
				{/if}
			{/each}
		</div>
	</Collapsible.Content>
</Collapsible.Root>

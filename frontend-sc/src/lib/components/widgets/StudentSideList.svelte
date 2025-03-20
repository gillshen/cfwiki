<script lang="ts">
	import type { StudentOfCferListItem } from '$lib/api/student';
	import { isCurrent } from '$lib/util/studentUtils';

	export let students: StudentOfCferListItem[];
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<div class="font-bold text-sm">Current Students</div>
		<div class="flex flex-col text-sm gap-2">
			{#each students.filter((s) => isCurrent(s)) as student}
				<a href={`/student/${student.id}`}>{student.fullname}</a>
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<div class="font-bold text-sm">Past Students</div>
		<div class="flex flex-col text-sm gap-2">
			{#each students.filter((s) => !isCurrent(s)) as student}
				<a href={`/student/${student.id}`}>{student.fullname}</a>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';

	import type { StudentDetail } from '$lib/api/student';
	import StudentInfobox from '$lib/components/infobox/StudentInfobox.svelte';
	import UpdateDeleteButton from '$lib/components/buttons/UpdateDeleteButton.svelte';

	export let student: StudentDetail;
	export let canEdit: boolean = false;
</script>

<article>
	<StudentInfobox {student} />

	{#if canEdit}
		<div class="mt-8">
			<UpdateDeleteButton
				text="Actions"
				updateAction={() => goto(`${student.id}/update`)}
				deleteAction={() => alert(`delete ${student.id}`)}
			/>
		</div>
	{/if}
</article>

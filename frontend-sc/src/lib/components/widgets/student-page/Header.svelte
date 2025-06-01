<script lang="ts">
	import type { StudentDetail } from '$lib/api/student';

	export let student: StudentDetail;
</script>

<h2 class="page-title mb-4">
	{student.fullname}
	{student.preferred_name || ''}
</h2>

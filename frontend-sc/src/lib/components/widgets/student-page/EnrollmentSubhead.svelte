<script lang="ts">
	import { cn } from '$lib/utils';
	import type { EnrollmentByStudent } from '$lib/api/enrollment';
	import { formatEnrollmentDates } from '$lib/util/enrollmentUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';

	export let enrollment: EnrollmentByStudent;
	export let className: string = '';
	export { className as class };
</script>

<div class={cn('w-fit px-4 inline-flex items-baseline', className)}>
	{formatEnrollmentDates(enrollment, toShortYearMonth)}
</div>

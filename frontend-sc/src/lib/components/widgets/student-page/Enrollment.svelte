<script lang="ts">
	import { cn } from '$lib/utils';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { EnrollmentByStudent } from '$lib/api/enrollment';
	import { formatEnrollmentDates } from '$lib/util/enrollmentUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';

	export let enrollment: EnrollmentByStudent;
	export let editable: boolean = false;
	export let editMode: boolean = false;
	export let href: string = '';

	$: enrollmentTitle = enrollment.school.name;
</script>

<div class="flex flex-col gap-1 my-2">
	{#if !editMode}
		<div class="flex items-center justify-between h-6 px-4">
			<h3 class="font-medium py-0">{enrollmentTitle}</h3>
		</div>
	{:else if editable}
		<div class="flex items-center justify-between">
			<Button variant="link" {href} class="h-6"
				>{enrollmentTitle}<MoveRight class="size-4 ml-2" /></Button
			>
		</div>
	{:else}
		<div class="flex items-center justify-between">
			<Button
				variant="link"
				href=""
				class="h-6 text-muted-foreground hover:no-underline hover:cursor-not-allowed"
				>{enrollmentTitle}</Button
			>
		</div>
	{/if}
	<p
		class={cn(
			'text-xs pl-4',
			editMode && !editable ? 'text-muted-foreground/70' : 'text-muted-foreground'
		)}
	>
		{formatEnrollmentDates(enrollment, toShortYearMonth)}
	</p>
</div>

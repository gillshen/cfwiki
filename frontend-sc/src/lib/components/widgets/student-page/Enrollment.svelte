<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/';
	import * as Table from '$lib/components/ui/table/';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import BookCheck from 'lucide-svelte/icons/book-check';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';

	import type { EnrollmentByStudent } from '$lib/api/enrollment';
	import { formatEnrollmentDates, formatProgression } from '$lib/util/enrollmentUtils';
	import { toShortYearMonth } from '$lib/util/dateUtils';
	import { formatGrade } from '$lib/util/gradeUtils';

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

	<Accordion.Root>
		<Accordion.Item value="enrollment-{enrollment.id}" class="border-none">
			<Accordion.Trigger
				class="font-normal px-4 inline-flex items-center py-0 text-muted-foreground hover:text-primary hover:no-underline hover:cursor-pointer"
			>
				{formatEnrollmentDates(enrollment, toShortYearMonth)}
			</Accordion.Trigger>
			<Accordion.Content class="px-4 pt-4 text-muted-foreground">
				<!-- link to the school page -->
				<a
					href="/school/{enrollment.school.id}"
					target="_blank"
					class="flex items-center w-fit underline"
				>
					<SquareArrowOutUpRight class="size-3.5 mr-2 translate-y-[2px]" />
					View school
				</a>

				<!-- curriculum/major -->
				<div class="flex items-center mt-2">
					{#if !enrollment.curriculum}
						<TriangleAlert class="size-3.5 mr-2" />
						No curriculum/major information
					{:else}
						<BookCheck class="size-3.5 mr-2" />
						{#if enrollment.program_type === 'Secondary School'}
							Curriculum: {enrollment.curriculum}
						{:else}
							Major: {enrollment.curriculum}
						{/if}
					{/if}
				</div>

				<!-- grades -->
				{#if enrollment.grades.length}
					<div class="mt-4 mb-2 px-4 py-2 rounded-lg border shadow-sm">
						<div class="py-2 pl-2">Grades</div>
						<Table.Root>
							<Table.Body>
								{#each enrollment.grades as grade}
									<Table.Row class="hover:bg-inherit">
										<Table.Cell class="w-[70px] tabular-nums pl-2"
											>{formatProgression(grade.progression)}</Table.Cell
										>
										<Table.Cell class="w-20">{grade.term}</Table.Cell>
										<Table.Cell class="tabular-nums flex-grow">{formatGrade(grade)}</Table.Cell>
										{#if parseInt(String(grade.scale))}
											<Table.Cell class="inline-flex pr-0 pl-2 text-right w-fit">
												<Badge variant="secondary" class="font-normal ml-2"
													>{grade.is_weighted ? 'Weighted' : 'Unweighted'}</Badge
												>
												{#if grade.is_cumulative}
													<Badge variant="secondary" class="font-normal ml-2">Cumul</Badge>
												{/if}
											</Table.Cell>
										{/if}
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				{:else}
					<div class="flex items-center mt-2">
						<TriangleAlert class="size-3.5 mr-2" />
						No grade information
					</div>
				{/if}
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

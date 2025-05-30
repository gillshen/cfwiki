<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Accordion from '$lib/components/ui/accordion/';
	import * as Table from '$lib/components/ui/table/';
	import MoveRight from 'lucide-svelte/icons/move-right';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import NotebookPen from 'lucide-svelte/icons/notebook-pen';
	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';

	import type { EnrollmentByStudent } from '$lib/api/enrollment';
	import EnrollmentSubhead from './EnrollmentSubhead.svelte';
	import GradeLabel from '$lib/components/misc/GradeLabel.svelte';
	import { formatProgression } from '$lib/util/enrollmentUtils';

	export let enrollment: EnrollmentByStudent;
	export let editable: boolean = false;
	export let editMode: boolean = false;
	export let href: string = '';

	$: enrollmentTitle = enrollment.school.name;

	$: gradesGrouped = Object.groupBy(enrollment.grades, (g) => g.progression) as Record<
		string,
		typeof enrollment.grades
	>;
</script>

<div class="flex flex-col gap-1 my-2">
	{#if !editMode}
		<div class="flex items-center justify-between h-6 px-4">
			<h3 class="font-medium py-0">{enrollmentTitle}</h3>
		</div>

		<Accordion.Root>
			<Accordion.Item value="enrollment-{enrollment.id}" class="border-none">
				<Accordion.Trigger
					class="font-normal py-0 pr-4 hover:no-underline text-muted-foreground hover:text-primary"
				>
					<EnrollmentSubhead {enrollment} />
				</Accordion.Trigger>
				<Accordion.Content class="px-4 py-3 text-muted-foreground">
					<div class="flex flex-col gap-2">
						<!-- curriculum/major -->
						{#if enrollment.curriculum}
							<div class="flex items-center">
								<BookOpen class="size-3.5 mr-1.5" />
								{#if enrollment.program_type === 'Secondary School'}
									Curriculum: {enrollment.curriculum}
								{:else}
									Major: {enrollment.curriculum}
								{/if}
							</div>
						{/if}

						<!-- grades -->
						{#if enrollment.grades.length}
							<div
								class="mt-4 mb-2 px-4 pt-2 py-2 rounded-lg border border-secondary shadow-sm relative"
							>
								<div class="py-1 pl-1 pr-2 absolute -top-[16px] -left-1 bg-white flex items-center">
									<NotebookPen class="size-3.5 mr-1.5" />Grades
								</div>
								<Table.Root>
									<Table.Body>
										{#each Object.entries(gradesGrouped) as [progression, grades]}
											<Table.Row class="hover:bg-inherit border-b-0">
												<Table.Cell class="pl-4 py-3 font-semibold"
													>{formatProgression(progression, { shortenYear: false })}</Table.Cell
												>
											</Table.Row>
											{#each grades as grade, index}
												<Table.Row
													class={cn('hover:bg-inherit', index < grades.length - 1 && 'border-b-0')}
												>
													<Table.Cell class="pb-3 pt-0 pl-4 w-24">{grade.term}</Table.Cell>
													<Table.Cell class="pb-3 pt-0 tabular-nums flex-grow">
														<GradeLabel {grade} />
													</Table.Cell>
													{#if parseInt(String(grade.scale))}
														<Table.Cell class="pb-3 pt-0 inline-flex pr-0 pl-2 text-right w-fit">
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
										{/each}
									</Table.Body>
								</Table.Root>
							</div>
						{/if}

						<!-- link to the school page -->
						<a
							href="/school/{enrollment.school.id}"
							target="_blank"
							class="flex items-center w-fit hover:underline text-blue-400"
						>
							<SquareArrowOutUpRight class="size-3.5 mr-1.5" />
							View school
						</a>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	{:else}
		{#if editable}
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
		<EnrollmentSubhead {enrollment} class="text-xs text-muted-foreground" />
	{/if}
</div>

<script lang="ts">
	import type { StudentDetail } from '$lib/api/student';
	import { formatLocation } from '$lib/util/studentUtils';
	import { toShortDate } from '$lib/util/dateUtils';
	import { toTitleCase } from '$lib/util/stringUtils';
	import countryFlags from '$lib/constants/countries';

	export let student: StudentDetail;
</script>

<section class="flex flex-col text-sm grow-0 shrink-0">
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2 mb-4">
			<h2 class="page-title">
				{student.fullname}
				{student.preferred_name || ''}
			</h2>
		</div>

		<!-- citizenship -->
		<hgroup class="flex flex-col gap-0.5">
			<h3 class="text-muted-foreground/80">Citizenship</h3>
			<p>
				{student.citizenship}&nbsp; {countryFlags[student.citizenship]}
			</p>
		</hgroup>

		<!-- gender -->
		<hgroup class="flex flex-col gap-0.5">
			<h3 class="text-muted-foreground/80">Gender</h3>
			<p>{toTitleCase(student.gender)}</p>
		</hgroup>

		<!-- date of birth -->
		<hgroup class="flex flex-col gap-0.5">
			<h3 class="text-muted-foreground/80">Date of Birth</h3>
			{#if student.date_of_birth}
				<p>{toShortDate(student.date_of_birth)}</p>
			{:else}
				<p class="text-muted-foreground/80">n/a</p>
			{/if}
		</hgroup>

		<!-- residence -->
		<hgroup class="flex flex-col gap-0.5">
			<h3 class="text-muted-foreground/80">Residence</h3>
			{#if student.base_country}
				<p>{formatLocation(student)}</p>
			{:else}
				<p class="text-muted-foreground/80">n/a</p>
			{/if}
		</hgroup>

		<!-- comments -->
		<hgroup class="flex flex-col gap-0.5">
			<h3 class="text-muted-foreground/80">Comments</h3>
			{#if student.comments}
				<p class="line-clamp-6">{student.comments}</p>
			{:else}
				<p class="text-muted-foreground/80">n/a</p>
			{/if}
		</hgroup>
	</div>
</section>

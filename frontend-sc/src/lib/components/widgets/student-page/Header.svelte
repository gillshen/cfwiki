<script lang="ts">
	import Globe from 'lucide-svelte/icons/globe';
	import Venus from 'lucide-svelte/icons/venus';
	import Mars from 'lucide-svelte/icons/mars';
	import NonBinary from 'lucide-svelte/icons/non-binary';
	import Gift from 'lucide-svelte/icons/gift';
	import House from 'lucide-svelte/icons/house';
	import NotepadText from 'lucide-svelte/icons/notepad-text';

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
		<hgroup class="flex flex-col gap-1">
			<h3 class="text-muted-foreground inline-flex items-center">
				<Globe class="size-3.5 mr-1.5" />Citizenship
			</h3>
			<p class="ml-5">
				{student.citizenship}&nbsp; {countryFlags[student.citizenship]}
			</p>
		</hgroup>

		<!-- gender -->
		<hgroup class="flex flex-col gap-1">
			<h3 class="text-muted-foreground inline-flex items-center">
				{#if student.gender === 'male'}
					<Mars class="size-3.5 mr-1.5" />
				{:else if student.gender === 'female'}
					<Venus class="size-3.5 mr-1.5" />
				{:else}
					<NonBinary class="size-3.5 mr-1.5" />
				{/if}
				Gender
			</h3>
			<p class="ml-5">{toTitleCase(student.gender)}</p>
		</hgroup>

		<!-- date of birth -->
		<hgroup class="flex flex-col gap-1">
			<h3 class="text-muted-foreground inline-flex items-center">
				<Gift class="size-3.5 mr-1.5" />Date of Birth
			</h3>
			{#if student.date_of_birth}
				<p class="ml-5">{toShortDate(student.date_of_birth)}</p>
			{:else}
				<p class="ml-5 text-muted-foreground">n/a</p>
			{/if}
		</hgroup>

		<!-- residence -->
		<hgroup class="flex flex-col gap-1">
			<h3 class="text-muted-foreground inline-flex items-center">
				<House class="size-3.5 mr-1.5" />Residence
			</h3>
			{#if student.base_country}
				<p class="ml-5">
					{formatLocation(student)}&nbsp; {countryFlags[student.base_country]}
				</p>
			{:else}
				<p class="ml-5 text-muted-foreground">n/a</p>
			{/if}
		</hgroup>

		<!-- comments -->
		<hgroup class="flex flex-col gap-1">
			<h3 class="text-muted-foreground inline-flex items-center">
				<NotepadText class="size-3.5 mr-1.5" />Comments
			</h3>
			{#if student.comments}
				<p class="ml-5 line-clamp-6">{student.comments}</p>
			{:else}
				<p class="ml-5 text-muted-foreground">n/a</p>
			{/if}
		</hgroup>
	</div>
</section>

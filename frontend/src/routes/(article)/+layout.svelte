<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Avatar,
		Hr,
		Heading
	} from 'flowbite-svelte';

	import {
		ChevronDownOutline,
		ChevronRightOutline,
		UserSettingsOutline,
		ArrowRightToBracketOutline
	} from 'flowbite-svelte-icons';

	import { Departments } from '$lib/api/user';
	import { quickAccessYears } from '$lib/utils/dateUtils';
	import { contractTypes } from '$lib/api/contract';
	import { contractTypeToSlug } from '$lib/utils/contractUtils';
	import { applicationTypes } from '$lib/api/application';
	import { formatApplicationType } from '$lib/utils/applicationUtils';
	import FooterYearGroupItem from '$lib/components/list-items/FooterYearGroupItem.svelte';

	export let data;

	// TODO
	const years = quickAccessYears();

	const activeUsers = data.cfUsers.filter((user) => user.is_active);
	const exUsers = data.cfUsers.filter((user) => !user.is_active);

	const cfSalesPeople = activeUsers
		.filter((user) => user.department === Departments.SALES)
		.sort((a, b) => a.username.localeCompare(b.username));

	const cfServicePeople = activeUsers
		.filter((user) => user.department === Departments.SERVICE)
		.sort((a, b) => a.username.localeCompare(b.username));

	$: pageWidth =
		$page.url.pathname.startsWith('/data/') &&
		!$page.url.pathname.startsWith('/data/schools/secondary-schools')
			? 'max-w-full'
			: 'max-w-[1280px]';
</script>

<div class={`container ${pageWidth} mx-auto px-8 pb-8 flex-grow-0`}>
	<div class="fixed top-0 left-0 w-full h-[60px] backdrop-blur bg-white/70 shadow-sm z-40">
		<Navbar fluid class={`h-[60px] !py-[2px] ${pageWidth} bg-transparent mx-auto !px-12`}>
			<NavBrand href="/home">
				<img src="/favicon.png" class="me-1 h-6" alt="CF Logo" />
				<span class="self-center whitespace-nowrap text-lg font-semibold">ChoiceFreezer</span>
			</NavBrand>

			<div class="flex align-baseline md:order-2 w-[150px] justify-end">
				<Avatar bordered size="sm" />
				<Dropdown class="w-[8rem] z-20" placement="bottom-end">
					<div slot="header" class="px-4 py-2">
						<span class="text-sm text-gray-900">{data.username}</span>
					</div>
					<DropdownItem
						on:click={() => goto('/account')}
						class="dropdown-link flex items-center gap-2"
					>
						<UserSettingsOutline />
						Account
					</DropdownItem>
					<DropdownItem
						on:click={() => goto('/logout')}
						class="dropdown-link flex items-center gap-2"
					>
						<ArrowRightToBracketOutline />
						Log Out
					</DropdownItem>
				</Dropdown>
				<NavHamburger />
			</div>

			<NavUl>
				<NavLi class="cursor-pointer">
					CF People<ChevronDownOutline class="dropdown-icon" />
				</NavLi>
				<Dropdown>
					<div class="grid grid-cols-4 gap-x-4 px-2 mb-2">
						{#each cfServicePeople as cfUser}
							<DropdownItem class="dropdown-link" href={`/cf/${cfUser.username}`}>
								{cfUser.username}
							</DropdownItem>
						{/each}
					</div>
					<DropdownDivider />
					<div class="grid grid-cols-4 gap-x-4 px-2 mb-2 mt-2">
						{#each cfSalesPeople as cfUser}
							<DropdownItem class="dropdown-link" href={`/cf/${cfUser.username}`}>
								{cfUser.username}
							</DropdownItem>
						{/each}
					</div>
					{#if exUsers.length}
						<DropdownDivider />
						<DropdownItem class="dropdown-link w-fit mx-2 mt-2 mb-1" href="/cf/index/ex">
							Ex-CFers
						</DropdownItem>
					{/if}
				</Dropdown>

				<NavLi class="cursor-pointer">
					Students<ChevronDownOutline class="dropdown-icon" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					{#each years as year}
						<DropdownItem class="flex items-center justify-between">
							{year}<ChevronRightOutline class="dropdown-icon" />
						</DropdownItem>
						<Dropdown class="w-44 z-30" placement="right-start">
							{#each contractTypes as contractType}
								<DropdownItem
									href={`/data/students/${year}/${contractTypeToSlug(contractType)}`}
									target="_self"
									class="dropdown-link"
								>
									{contractType === 'Other' ? 'Other Contracts' : contractType}
								</DropdownItem>
							{/each}
						</Dropdown>
					{/each}
					<DropdownDivider />
					<DropdownItem href="/data/students/current" class="dropdown-link">Current</DropdownItem>
					<DropdownItem href="/data/students/all" class="dropdown-link">All</DropdownItem>
				</Dropdown>

				<NavLi class="cursor-pointer">
					Applications<ChevronDownOutline class="dropdown-icon" />
				</NavLi>
				<Dropdown class="w-44 z-20">
					{#each years as year}
						<DropdownItem class="flex items-center justify-between">
							{year}<ChevronRightOutline class="dropdown-icon" />
						</DropdownItem>
						<Dropdown class="w-44 z-30" placement="right-start">
							{#each applicationTypes as applicationType}
								{@const formattedType = formatApplicationType(applicationType)}
								<DropdownItem
									href={`/data/applications/${year}/${applicationType}`}
									target="_self"
									class="dropdown-link"
								>
									{formattedType === 'Other' ? 'Non-degree/Other' : formattedType}
								</DropdownItem>
							{/each}
						</Dropdown>
					{/each}
					<DropdownDivider />
					<DropdownItem href="/data/applications/pending" class="dropdown-link">
						Pending
					</DropdownItem>
					<DropdownItem href="/data/applications/all" class="dropdown-link">All</DropdownItem>
				</Dropdown>

				<NavLi class="cursor-pointer">
					Schools & Programs<ChevronDownOutline class="dropdown-icon" />
				</NavLi>
				<Dropdown placement="bottom" class="w-60 z-20">
					<DropdownItem href="/data/schools/universities" class="dropdown-link">
						Universities
					</DropdownItem>
					<DropdownItem href="/data/schools/secondary-schools" class="dropdown-link">
						Secondary Schools
					</DropdownItem>
					<DropdownItem href="/data/schools/other-institutions" class="dropdown-link">
						Other Institutions
					</DropdownItem>

					<DropdownDivider />

					<DropdownItem href="/data/programs/undergraduate" class="dropdown-link">
						Undergraduate Programs
					</DropdownItem>
					<DropdownItem href="/data/programs/graduate" class="dropdown-link">
						Graduate Programs
					</DropdownItem>
					<DropdownItem href="/data/programs/non-degree" class="dropdown-link">
						Non-degree Programs
					</DropdownItem>

					<DropdownDivider />

					<DropdownItem href="/collection/index" class="dropdown-link">
						Program Collections
					</DropdownItem>
				</Dropdown>
			</NavUl>
		</Navbar>
	</div>

	<div class="mt-[84px] px-4 flex flex-col justify-between min-h-[calc(100vh-280px)] flex-grow">
		<div class="flex flex-col flex-grow">
			<slot />
		</div>
	</div>
</div>

<Hr hrClass="mt-8" />

<div class="footer bg-stone-100">
	<div
		class="container max-w-[1280px] mx-auto px-12 pt-8 pb-12 grid grid-cols-[2fr_3fr_2fr_2fr_2fr] gap-x-4"
	>
		<article>
			<NavBrand href="/home">
				<img src="/favicon.png" class="me-1 h-6" alt="CF Logo" />
				<span class="self-center whitespace-nowrap text-lg font-semibold">ChoiceFreezer</span>
			</NavBrand>

			<div class="text-sm mt-4 translate-x-1">&copy; just-a-test</div>
		</article>

		<article class="border-r-[1px] border-solid mr-6">
			<Heading tag="h3" class="text-lg font-medium">CF People</Heading>
			<div class="grid grid-cols-2 mt-2">
				<ul>
					{#each cfServicePeople as cfer}
						<li><a href={`/cf/${cfer.username}`}>{cfer.username}</a></li>
					{/each}
				</ul>
				<ul>
					{#each cfSalesPeople as cfer}
						<li><a href={`/cf/${cfer.username}`}>{cfer.username}</a></li>
					{/each}
					<li><a href="/cf/index/ex" class="block mt-3">Ex-CFers</a></li>
				</ul>
			</div>
		</article>

		<article>
			<Heading tag="h3" class="text-lg font-medium">Students</Heading>
			<FooterYearGroupItem {years} domain="students" />
			<ul class="mt-3">
				<li><a href="/data/students/current">Current Students</a></li>
				<li><a href="/data/students/all">All Students</a></li>
				<li class="mt-2"><a href="/student/new">Create New</a></li>
			</ul>
		</article>

		<article>
			<Heading tag="h3" class="text-lg font-medium">Applications</Heading>
			<FooterYearGroupItem {years} domain="applications" />
			<ul class="mt-3">
				<li><a href="/data/applications/pending">Pending Applications</a></li>
				<li><a href="/data/applications/all">All Applications</a></li>
			</ul>
		</article>

		<article>
			<Heading tag="h3" class="text-lg font-medium">Schools</Heading>
			<ul class="mt-2">
				<li><a href="/data/schools/universities">Universities</a></li>
				<li><a href="/data/schools/secondary-schools">Secondary Schools</a></li>
				<li><a href="/data/schools/other-institutions">Other Institutions</a></li>
				<li class="mt-2"><a href="/school/new">Create New</a></li>
			</ul>

			<Heading tag="h3" class="mt-8 text-lg font-medium">Programs</Heading>
			<ul class="mt-2">
				<li><a href="/data/programs/undergraduate">Undergraduate</a></li>
				<li><a href="/data/programs/graduate">Graduate</a></li>
				<li><a href="/data/programs/non-degree">Non-degree</a></li>
				<li class="mt-2"><a href="/collection/index">Program Collections</a></li>
			</ul>
		</article>
	</div>
</div>

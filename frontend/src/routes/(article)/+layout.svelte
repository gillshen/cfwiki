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
					<div>CF People<ChevronDownOutline class="dropdown-icon" /></div>

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
				</NavLi>

				<NavLi class="cursor-pointer">
					<div>Students<ChevronDownOutline class="dropdown-icon" /></div>

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
				</NavLi>

				<NavLi class="cursor-pointer">
					<div>Applications<ChevronDownOutline class="dropdown-icon" /></div>

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
				</NavLi>

				<NavLi class="cursor-pointer">
					<div>Schools & Programs<ChevronDownOutline class="dropdown-icon" /></div>

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
				</NavLi>
			</NavUl>
		</Navbar>
	</div>

	<div class="mt-[84px] px-4 flex flex-col justify-between min-h-[calc(100vh-360px)] flex-grow">
		<div class="flex flex-col flex-grow">
			<slot />
		</div>
	</div>
</div>

<Hr hrClass="mt-8" />

<div class="footer bg-stone-100">
	<div class="container max-w-5xl mx-auto flex flex-col px-12 pt-8 pb-16">
		<article class="mx-auto flex flex-col">
			<!-- Use pr to shift to the right slightly for better visual balance -->
			<div class="flex items-center pr-8">
				<img src="/favicon.png" class="me-1 h-6" alt="CF Logo" />
				<span class="self-center whitespace-nowrap text-lg font-semibold">ChoiceFreezer</span>
			</div>
		</article>

		<div class="flex gap-8 justify-between mt-8 text-sm">
			<article class="flex flex-col justify-between">
				<div class="flex flex-col gap-2 pt-1">
					<a href="/home">Home</a>
					<a href="/cf/index">CF People</a>
					<a href="/cf-academy">CF Academy</a>
					<a href="/collection/index">Program Collections</a>
					<a href="/ranking/index">School Rankings</a>
				</div>

				<div class="text-sm text-gray-700 flex gap-0.5">
					<span class="translate-y-0.5">&copy;</span>
					just-a-test
				</div>
			</article>

			<article class="flex flex-col gap-2">
				<Heading
					tag="h3"
					class="section-title text-base font-normal border-b-[1px] border-solid h-7 !text-stone-600"
				>
					Undergraduate
				</Heading>
				<a href="/data/programs/undergraduate">Programs</a>
				<a href="/data/students/freshman">Freshman Applicants</a>
				<a href="/data/applications/freshman">Freshman Applications</a>
				<a href="/data/students/transfer">Transfer Applicants</a>
				<a href="/data/applications/transfer">Transfer Applications</a>
				<!-- TODO -->
				<div title="TODO" class="text-gray-400">Statistics</div>
			</article>

			<article class="flex flex-col gap-2">
				<Heading
					tag="h3"
					class="section-title text-base font-normal border-b-[1px] border-solid h-7 !text-stone-600"
				>
					Graduate
				</Heading>
				<a href="/data/programs/graduate">Programs</a>
				<a href="/data/students/graduate">Applicants</a>
				<a href="/data/applications/graduate">Applications</a>
				<!-- TODO -->
				<div title="TODO" class="text-gray-400">Statistics</div>
			</article>

			<article class="flex flex-col gap-2">
				<Heading
					tag="h3"
					class="section-title text-base font-normal border-b-[1px] border-solid h-7 !text-stone-600"
				>
					Other
				</Heading>
				<a href="/data/programs/other">Programs</a>
				<a href="/data/students/other">Applicants</a>
				<a href="/data/applications/other">Applications</a>
				<!-- TODO -->
				<div title="TODO" class="text-gray-400">Statistics</div>
			</article>
		</div>
	</div>
</div>

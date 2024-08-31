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
		Hr
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

<div class={`container ${pageWidth} mx-auto px-12 pb-8`}>
	<Navbar fluid>
		<NavBrand href="/home">
			<img src="/favicon.png" class="me-3 h-6" alt="CF Logo" />
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
					class="dropdown-link flex items-center gap-2 justify-between"
				>
					Account
					<UserSettingsOutline />
				</DropdownItem>
				<DropdownItem
					on:click={() => goto('/logout')}
					class="dropdown-link flex items-center gap-2 justify-between"
				>
					Log out
					<ArrowRightToBracketOutline />
				</DropdownItem>
			</Dropdown>
			<NavHamburger />
		</div>

		<NavUl>
			<NavLi class="cursor-pointer">
				CFers<ChevronDownOutline class="dropdown-icon" />
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
					<DropdownItem class="dropdown-link w-fit mx-2 mt-2 mb-1" href="/excf">
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
								{contractType}
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
							<DropdownItem
								href={`/data/applications/${year}/${applicationType}`}
								target="_self"
								class="dropdown-link"
							>
								{formatApplicationType(applicationType)}
							</DropdownItem>
						{/each}
					</Dropdown>
				{/each}
				<DropdownDivider />
				<DropdownItem href="/data/applications/pending" class="dropdown-link">Pending</DropdownItem>
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
					Secondary schools
				</DropdownItem>
				<DropdownItem href="/data/schools/other-institutions" class="dropdown-link">
					Other institutions
				</DropdownItem>

				<DropdownDivider />

				<DropdownItem href="/data/programs/undergraduate" class="dropdown-link">
					Undergraduate programs
				</DropdownItem>
				<DropdownItem href="/data/programs/graduate" class="dropdown-link">
					Graduate programs
				</DropdownItem>
				<DropdownItem href="/data/programs/non-degree" class="dropdown-link">
					Non-degree programs
				</DropdownItem>
			</Dropdown>
		</NavUl>
	</Navbar>

	<div class="px-4 flex flex-col justify-between min-h-[calc(100vh-108px)]">
		<div>
			<slot />
		</div>
		<Hr hrClass="mt-12" />
	</div>
</div>

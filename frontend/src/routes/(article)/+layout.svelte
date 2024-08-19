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

	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	import { Departments } from '$lib/api/user';
	import { quickAccessYears } from '$lib/utils/dateUtils';

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

	$: pageWidth = $page.url.pathname.startsWith('/data') ? 'max-w-full' : 'max-w-[1280px]';
</script>

<div class={`container ${pageWidth} mx-auto px-12 pb-8`}>
	<Navbar fluid>
		<NavBrand href="/home">
			<img src="/favicon.png" class="me-3 h-6" alt="CF Logo" />
			<span class="self-center whitespace-nowrap text-lg font-semibold">ChoiceFreezer</span>
		</NavBrand>

		<div class="flex align-baseline md:order-2 ml-12">
			<Avatar bordered size="sm" />
			<Dropdown class="w-[8rem] z-20" placement="bottom-end">
				<DropdownItem>Account</DropdownItem>
				<DropdownItem on:click={() => goto('/logout')}>Log out</DropdownItem>
			</Dropdown>
			<NavHamburger />
		</div>

		<NavUl>
			<NavLi class="cursor-pointer">
				CFers<ChevronDownOutline class="dropdown-icon" />
			</NavLi>
			<Dropdown>
				<div class="grid grid-cols-4 gap-x-4 px-1">
					{#each cfServicePeople as cfUser}
						<DropdownItem class="rounded-md" href={`/cf/${cfUser.username}`}
							>{cfUser.username}</DropdownItem
						>
					{/each}
				</div>
				<DropdownDivider />
				<div class="grid grid-cols-4 gap-x-4 px-1">
					{#each cfSalesPeople as cfUser}
						<DropdownItem class="rounded-md" href={`/cf/${cfUser.username}`}>
							{cfUser.username}
						</DropdownItem>
					{/each}
				</div>
				{#if exUsers.length}
					<DropdownDivider />
					<DropdownItem class="rounded-md w-fit mx-1" href="/excf">Ex-CFers</DropdownItem>
				{/if}
			</Dropdown>

			<NavLi class="cursor-pointer">
				Students<ChevronDownOutline class="dropdown-icon" />
			</NavLi>
			<Dropdown class="w-44 z-20">
				{#each years as year}
					<DropdownItem href={`/data/students?year=${year}`}>{year}</DropdownItem>
				{/each}
				<DropdownDivider />
				<DropdownItem href="/data/students?status=current">Current</DropdownItem>
				<DropdownItem href="/data/students">All</DropdownItem>
			</Dropdown>

			<NavLi class="cursor-pointer">
				Applications<ChevronDownOutline class="dropdown-icon" />
			</NavLi>
			<Dropdown class="w-44 z-20">
				{#each years as year}
					<DropdownItem href={`/data/applications?year=${year}`}>{year}</DropdownItem>
				{/each}
				<DropdownDivider />
				<DropdownItem href="/data/applications?status=pending">Pending</DropdownItem>
				<DropdownItem href="/data/applications">All</DropdownItem>
			</Dropdown>

			<NavLi class="cursor-pointer">
				More<ChevronDownOutline class="dropdown-icon" />
			</NavLi>
			<Dropdown placement="bottom" class="w-32 z-20">
				<DropdownItem href="/data/schools">Schools</DropdownItem>
				<DropdownItem href="/data/programs">Programs</DropdownItem>
			</Dropdown>
		</NavUl>
	</Navbar>

	<div class="px-4 flex flex-col justify-between min-h-[calc(100vh-108px)]">
		<div>
			<slot />
		</div>
		<Hr hrClass="mt-16" />
	</div>
</div>

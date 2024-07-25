<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
</script>

<div class="p-24 w-[60rem]">
	<Tabs tabStyle="underline">
		<TabItem title="Students" open>
			<Button href="/student/new">Create a student file</Button>
		</TabItem>

		<TabItem title="Applications">
			<Button href="">Create an application</Button>
		</TabItem>
	</Tabs>
</div>

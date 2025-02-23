<script lang="ts">
	export let data;

	const { studentId, contract, programType, year, term } = data;
</script>

<h1 class="page-title mb-2">Create Applications</h1>

<div class="flex gap-1 pb-6 text-gray-600">
	<div>{data.contract.student_name}</div>
	<div>&bullet;</div>
	<div>{data.programType}</div>
	<div>&bullet;</div>
	<div>{data.term} {data.year}</div>
</div>

<pre class="text-sm bg-zinc-100 p-2 rounded-md">{JSON.stringify(
		{ studentId, contract, programType, year, term },
		null,
		2
	)}</pre>

<div class="flex gap-8 items-center pt-4">
	<!-- negative ml to visually align the big circle vertically -->
	<!-- add pt to visually align it better horizontally -->
	<div class="w-[150px] flex-none -ml-1 pt-6">
		<slot name="header" />
	</div>

	<div class="w-full flex flex-col gap-3">
		<slot name="body" />
	</div>
</div>

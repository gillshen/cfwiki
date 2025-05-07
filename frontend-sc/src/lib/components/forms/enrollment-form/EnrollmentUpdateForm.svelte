<script lang="ts">
	import { cn } from '$lib/utils';
	import { type SuperValidated, type Infer, superForm, type SuperForm } from 'sveltekit-superforms';
	import type { CommonEnrollmentSchema, EnrollmentUpdateSchema } from '$lib/schemas/enrollment';
	import type { BaseEnrollment } from '$lib/api/enrollment';
	import { secondaryProgressions, universityProgressions } from '$lib/constants/progressions';
	import EnrollmentUpdateFormFields from './CommonEnrollmentFormFields.svelte';

	export let data: SuperValidated<Infer<EnrollmentUpdateSchema>>;
	export let onUpdated: (event: { form: typeof data }) => any;
	export let action: string = '?/updateEnrollment';
	export let className: string = '';
	export let enrollment: BaseEnrollment;
	export { className as class };

	const id = `enrollment-form-${enrollment?.id}`;

	const form = superForm(data, { id, resetForm: false, onUpdated }) as unknown as SuperForm<
		Infer<CommonEnrollmentSchema>
	>;
	const { form: formData, enhance } = form;
	$formData = { ...$formData, ...enrollment };

	const progressions =
		enrollment.program_type === 'Secondary School' ? secondaryProgressions : universityProgressions;
</script>

<form
	method="POST"
	{id}
	{action}
	class={cn('max-w-prose space-y-4 my-4 mx-auto', className)}
	use:enhance
>
	<input type="number" name="id" value={enrollment.id} hidden />

	<EnrollmentUpdateFormFields {form} programType={enrollment.program_type} {progressions} />
</form>

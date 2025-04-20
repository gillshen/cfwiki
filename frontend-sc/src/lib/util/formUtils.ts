import type { ZodObject } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, fail, message } from 'sveltekit-superforms';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formAction = <T extends ZodObject<any>>(
	schema: T,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	apiCall: (data: any) => Promise<Response>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSuccess?: (resp?: any) => void
) => {
	return async ({ request }: { request: Request }) => {
		const form = await superValidate(request, zod(schema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await apiCall(form.data);

		if (!response.ok) {
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		if (onSuccess === undefined) {
			return message(form, 'success');
		}

		if (response.status === 204) {
			// DELETE successful
			return onSuccess();
		} else {
			const obj = await response.json();
			return onSuccess(obj);
		}
	};
};

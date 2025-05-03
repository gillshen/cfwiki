import type { RequestEvent } from '@sveltejs/kit';
import type { ZodObject } from 'zod';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formAction = <T extends ZodObject<any>>(
	schema: T,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	apiCall: (data: any) => Promise<Response>,
	onSuccess?: (params: { event?: RequestEvent; response?: Response }) => Promise<unknown>
) => {
	return async (event: RequestEvent) => {
		const form = await superValidate(event.request, zod(schema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await apiCall(form.data);

		if (!response.ok) {
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		if (onSuccess) {
			await onSuccess({ event, response });
		}
		return message(form, 'success');
	};
};

export type SelectOption = { label: string; value: string };

export const normalizeSelectItems = (item: SelectOption | string | number): SelectOption => {
	if (typeof item === 'string') {
		return { label: item, value: item };
	}
	if (typeof item === 'number') {
		return { label: item.toString(), value: item.toString() };
	}
	return item;
};

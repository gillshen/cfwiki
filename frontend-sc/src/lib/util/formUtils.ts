import type { RequestEvent } from '@sveltejs/kit';
import type { ZodObject, ZodRawShape } from 'zod';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { GradeSchema } from '$lib/schemas/grade';

export const formAction = <T extends ZodObject<ZodRawShape>>(
	// gradeSchema is not a ZodObject, but a ZodEffects object with two more layers
	// of ZodEffects nested within it;
	// I judge that an explicitly ad hoc fix is no worse than writing a horrendously nested type
	schema: T | GradeSchema,
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

import type { RequestEvent } from '@sveltejs/kit';
import type { ZodObject, ZodRawShape } from 'zod';
import { superValidate, fail, message, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { NewProgramSchema } from '$lib/schemas/program';
import type { GradeSchema } from '$lib/schemas/grade';
import type { GmatScoreSchema } from '$lib/schemas/scores';
import type { PasswordSchema } from '$lib/schemas/user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuperValidatedForm = SuperValidated<Record<string, unknown>, any, Record<string, unknown>>;

export const formAction = <T extends ZodObject<ZodRawShape>>(
	schema: T | NewProgramSchema | GradeSchema | GmatScoreSchema | PasswordSchema,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	func: (data: any) => Promise<Response>,
	hooks?: {
		prepForm?: (form: SuperValidatedForm) => SuperValidatedForm;
		onSuccess?: (params: { event?: RequestEvent; response?: Response }) => Promise<unknown>;
	}
) => {
	return async (event: RequestEvent) => {
		const rawForm = await superValidate(event.request, zod(schema));
		const form = hooks?.prepForm ? hooks.prepForm(rawForm) : rawForm;
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await func(form.data);

		if (!response.ok) {
			return message(form, 'Sorry, an error occurred', { status: 400 });
		}

		if (hooks?.onSuccess) {
			await hooks.onSuccess({ event, response });
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

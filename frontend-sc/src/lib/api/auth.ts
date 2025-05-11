import type { Cookies } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import { isBefore } from 'date-fns';

import { post } from '$lib/api/core';

type Token = {
	token_type: 'access' | 'refresh';
	exp: number;
	iat: number;
	jti: string;
	user_id: number;
	username: string;
	is_active: boolean;
	is_staff: boolean;
	is_superuser: boolean;
};

type User = {
	id: number;
	username: string;
	is_active: boolean;
	is_staff: boolean;
	is_superuser: boolean;
};

export const authenticateUser = async (cookies: Cookies): Promise<User | null> => {
	const accessToken = cookies.get('access');

	if (!accessToken) {
		return null;
	}

	const decoded = jwtDecode(accessToken) as Token;

	if (isBefore(new Date(), new Date(decoded.exp * 1000))) {
		// the access token is still valid
		return {
			id: decoded.user_id,
			...decoded
		};
	}

	// the access token has expired
	const refreshToken = cookies.get('refresh');

	if (!refreshToken) {
		return null;
	}

	const response = await refreshAccess(refreshToken);

	if (!response) {
		return null;
	}

	setCookies({ cookies, response });
	const newDecoded = jwtDecode(response.access) as Token;

	return {
		id: newDecoded.user_id,
		...newDecoded
	};
};

export const getAccess = async (data: {
	username: string;
	password: string;
}): Promise<{ access: string; refresh: string } | null> => {
	const response = await post('token/', data);

	if (!response.ok) {
		console.log(response.status, response.statusText);
		return null;
	}

	return await response.json();
};

const refreshAccess = async (
	refreshToken: string
): Promise<{ access: string; refresh: string } | null> => {
	const response = await post('token/refresh/', { refresh: refreshToken });

	if (!response.ok) {
		console.log(response.status, response.statusText);
		return null;
	}

	return await response.json();
};

export const setCookies = ({
	cookies,
	response
}: {
	cookies: Cookies;
	response: { access: string; refresh: string };
}) => {
	cookies.set('access', response.access, cookiesOptions);
	cookies.set('refresh', response.refresh, cookiesOptions);
};

export const deleteCookies = (cookies: Cookies) => {
	const opts = { path: '/' };
	cookies.delete('access', opts);
	cookies.delete('refresh', opts);
};

export const cookiesOptions: { httpOnly: boolean; sameSite: 'strict'; path: string } = {
	httpOnly: true,
	sameSite: 'strict',
	path: '/'
};

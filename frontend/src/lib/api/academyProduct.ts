import { destroy, get, patch, post } from '$lib/api/api';

export type AcademyProductListItem = {
	id: number;
	name: string;
};

export type AcademyProductDetail = AcademyProductListItem & {
	students: { id: number; fullname: string }[];
};

export async function fetchAcademyProducts(): Promise<AcademyProductListItem[]> {
	return await get('academy-products/');
}

export async function fetchAcademyProduct(id: number): Promise<AcademyProductDetail> {
	return await get(`academy-products/${id}/`, 'Product not found');
}

export async function createAcademyProduct(data: any) {
	return await post('academy-products/new/', data);
}

export async function updateAcademyProduct(data: any) {
	return await patch(`academy-products/${data.id}/update/`, data);
}

export async function deleteAcademyProduct(data: any) {
	return await destroy(`academy-products/${data.id}/update/`);
}

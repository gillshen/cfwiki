export const startYear = 2020;
export const currentYear = new Date().getFullYear();
export const endYear = currentYear + 5;

export const activeYears = Array.from({ length: endYear - startYear }, (_, k) => k + startYear);

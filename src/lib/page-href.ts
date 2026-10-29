/** URL of one page of a paged list: the first page is the plain path, later pages add ?page=. */
export const pageHref = (basePath: string, page: number) => (page > 1 ? `${basePath}?page=${page}` : basePath);

export interface PagedResponse<T> {
  content: T[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  number: number;
  numberOfElements: number;
}
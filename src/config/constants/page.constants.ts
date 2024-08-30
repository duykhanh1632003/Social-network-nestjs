export interface ExtendedResponse<T> {
  result: boolean;
  code: number;
  data: T;
}

export interface ListOutputValue {
  list: any[];
  totalResult?: number;
  totalPage?: number;
  search?: string | null;
  page?: number;
  [key: string]: any; // Các trường khác có thể có trong data
}

export const NON_PAGINATION = 'NON_PAGENATION';

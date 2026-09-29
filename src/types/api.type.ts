export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: Meta;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string;
  errors?: ApiFieldError[];
  requestId?: string;
}

export type SortOrder = "asc" | "desc";

export interface ListParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

/** Prisma Decimal columns arrive as strings; computed summaries as numbers. */
export type Money = string | number;

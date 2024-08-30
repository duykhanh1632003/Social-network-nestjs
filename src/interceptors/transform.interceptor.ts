import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExtendedResponse, ListOutputValue, NON_PAGINATION } from '../config/constant';

export const calcListTotalCount = (
  totalCount = 0,
  limit = 0,
): { totalResult: number; totalPage: number } => {
  const totalResult = totalCount;
  const totalPage =
    limit === 0 || totalResult === 0
      ? 1
      : Math.ceil(totalResult / limit); // Tính tổng số trang
  return { totalResult, totalPage };
};

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ExtendedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExtendedResponse<T>> {
    const request: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((value) => {
        if (value instanceof Object && 'count' in value && 'list' in value) {
          const { list, count, ...restData } = value;
            
          const limit = request.query['limit']
            ? parseInt(request.query['limit'] as string, 10)
            : NON_PAGINATION;

          const page = request.query['page']
            ? parseInt(request.query['page'] as string, 10)
            : 1;

          const search = request.query['search'] || null;

          return {
            result: true,
            code: 1000,
            data: {
              ...restData,
              list,
              ...(limit === NON_PAGINATION
                ? { totalResult: count, totalPage: 1 }
                : calcListTotalCount(count, limit)),
              search,
              page,
            } as ListOutputValue,
          };
        }

        return { result: true, code: 1000, data: value };
      }),
    );
  }
}

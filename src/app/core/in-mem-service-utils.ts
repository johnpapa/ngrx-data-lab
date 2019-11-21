import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  RequestInfo,
  ResponseOptions,
  STATUS
} from 'angular-in-memory-web-api';
export { RequestInfo, ResponseOptions, STATUS };

export function createOkResponse$(
  req: RequestInfo,
  body?: any,
  headers?: HttpHeaders
) {
  return createResponse$(req, STATUS.OK, 'OK', body, headers);
}

export function createNoContentResponse$(
  req: RequestInfo,
  headers?: HttpHeaders
): Observable<HttpResponse<any>> {
  return createResponse$(req, STATUS.NO_CONTENT, 'NO CONTENT', null, headers);
}
export function createNotFoundResponse$(
  req: RequestInfo,
  headers?: HttpHeaders
): Observable<HttpResponse<any>> {
  return createResponse$(req, STATUS.NOT_FOUND, 'NOT FOUND', null, headers);
}
/** Generic bad request response */
export function createBadRequestResponse$(
  req: RequestInfo,
  body?: any,
  headers?: HttpHeaders
) {
  return createResponse$(req, STATUS.BAD_REQUEST, 'BAD REQUEST', body, headers);
}

/**
 * Custom response of any kind
 * @param requestInfo
 * @param status Http status code. See STATUS.
 * @param statusText Http status text for that code.
 * @param [body] The body, if any
 * @param [headers] Headers, if any. Creates empty headers object if none supplied.
 * @returns A cold response Observable from a factory for ResponseOptions
 */
export function createResponse$(
  requestInfo: RequestInfo,
  status: number,
  statusText: string,
  body?: any,
  headers?: HttpHeaders
) {
  const options: ResponseOptions = {
    url: requestInfo.url,
    status,
    statusText,
    body,
    headers: headers || new HttpHeaders()
  };
  return requestInfo.utils.createResponse$(() => options);
}

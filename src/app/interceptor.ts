import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class Interceptor {
    constructor() { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('token') == -1) {
            const authRequest = req.clone({
                setHeaders: {
                    //'Authorization': `Bearer ${this.auth.getToken()}`
                }
            });
            return next.handle(authRequest).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
            },
                (err: any) => {
                }));
        }
        else {
            return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
            },
                (err: any) => {
                }));
        }
    }
}

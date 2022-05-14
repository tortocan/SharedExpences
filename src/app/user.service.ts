import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from './expense.service';
import { QueryService, ServiceResource } from './query.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headersParams: HttpHeaders;
  constructor(private http: HttpClient,private queryService: QueryService) { }

  getUsers(): Observable<IUser[]>  {
    const url = this.queryService.buildUrl(ServiceResource.User);
    return this.http.get<IUser[]>(url, { headers: this.headersParams })
    .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QueryService, ServiceResource } from './query.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export interface IPayment {
  Id: number;
  Date: Date;
  Amount: number;
  Description: string;
}

export interface IExpenseGroup {
  Id: number;
}

export interface IUser {
  Id: number;
  FullName: string;
}

export interface IExpense {
  Payment: IPayment;
  User: IUser;
  ExpenseGroup: IExpenseGroup;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  headersParams: HttpHeaders;

  constructor(private http: HttpClient, private queryService: QueryService) { }

  getExpenses(defaultExpenseGroupId: number): Observable<IExpense[]> {
    this.queryService.addOrUpdateQueryParam({ key: 'expenseGroupId', value: defaultExpenseGroupId});
    const url = this.queryService.buildUrl(ServiceResource.Expenses);
    var result:IExpense[] =[];
    return this.http.get<IExpense[]>(url, { headers: this.headersParams })
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

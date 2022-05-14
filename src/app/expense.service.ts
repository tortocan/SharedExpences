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

export interface IBalance {
  User:IUser,
  Amount: number
}
export interface IBalanceDue {
  To: IUser,
  From: IUser,
  Amount: number
}

export interface IBalanceSummary {
  Balance: IBalance[],
  BalanceDue: IBalanceDue[]
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  headersParams: HttpHeaders;

  constructor(private http: HttpClient, private queryService: QueryService) { }

  addExpense(request:  { UserId: number; ExpenseGroupId: number; Expense: IExpense; }): Observable<Boolean>  {
    const url = this.queryService.buildUrl(ServiceResource.Expenses);
    return this.http.post<boolean>(url,request);
  }

  addUserToExpenseGroup(request: { userId: number; expenseGroupId: number; }) : Observable<Boolean>  {
    const url = this.queryService.buildUrl(ServiceResource.AddUserToExpenseGroup);
    return this.http.post<boolean>(url,request);
  }

  getExpenseGroupBalance(request: { expenseGroupId: number; }): Observable<IBalanceSummary> {
    this.queryService.addOrUpdateQueryParam({ key: 'expenseGroupId', value: request.expenseGroupId});
    const url = this.queryService.buildUrl(ServiceResource.Expenses,ServiceResource.GetExpenseGroupBalance);
    return this.http.get<IBalanceSummary>(url, { headers: this.headersParams })
    .pipe(retry(0), catchError(this.handleError));
  }

  getExpenseGroupUsers(defaultExpenseGroupId: number): Observable<IUser[]>  {
    this.queryService.addOrUpdateQueryParam({ key: 'expenseGroupId', value: defaultExpenseGroupId});
    const url = this.queryService.buildUrl(ServiceResource.Expenses,ServiceResource.GetExpenseGroupUsers);
    return this.http.get<IUser[]>(url, { headers: this.headersParams })
    .pipe(retry(0), catchError(this.handleError));
  }

  getExpenses(defaultExpenseGroupId: number): Observable<IExpense[]> {
    this.queryService.addOrUpdateQueryParam({ key: 'expenseGroupId', value: defaultExpenseGroupId});
    const url = this.queryService.buildUrl(ServiceResource.Expenses);
    return this.http.get<IExpense[]>(url, { headers: this.headersParams })
    .pipe(retry(0), catchError(this.handleError));
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

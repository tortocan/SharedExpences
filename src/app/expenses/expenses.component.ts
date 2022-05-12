import { Component, OnInit } from '@angular/core';
import { ExpenseService, IExpense } from '../expense.service';
import moment from 'moment';
import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses: IExpense[] = [];
  defaultExpenseGroupId: number = 1;
  constructor(private expenseService: ExpenseService) {
  }

  ngOnInit(): void {
    this.expenseService.getExpenses(this.defaultExpenseGroupId).subscribe((data: any) => {
      this.expenses = data ;
    });;
  }

}
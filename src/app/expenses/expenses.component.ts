import { Component, OnInit } from '@angular/core';
import { ExpenseService, IExpense, IUser } from '../expense.service';
import moment from 'moment';
import 'moment/locale/es'  // without this line it didn't work
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';
import { UserService } from '../user.service';
import { ToastService } from '../toast.service';
moment.locale('es')

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses: IExpense[] = [];
  users: IUser[] = [];
  defaultExpenseGroupId: number = 1;
  paymentAmount = new FormControl('');
  paymentDescription = new FormControl('');
  selectedUser: IUser;
  selectedUserTitle = "Selecionar un usuario";

  constructor(private expenseService: ExpenseService, private modalService: NgbModal, private userService: UserService, private toast: ToastService) {
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.selectedUserTitle = user.FullName;
  }

  addExpense() {
    const expense: IExpense = {
      User: this.selectedUser,
      Payment: {
        Amount: this.paymentAmount.value as number,
        Description: this.paymentDescription.value as string,
        Date: new Date()
      },
      ExpenseGroup: {
        Id: this.defaultExpenseGroupId
      }
    } as IExpense;

    let request = {
      UserId: this.selectedUser.Id,
      ExpenseGroupId: this.defaultExpenseGroupId,
      Expense: expense
    };
    this.expenseService.addExpense(request).subscribe({
      next: (data) => {
        console.log(data);
        this.expenses.unshift(expense);
        this.toast.success("Nuevo gasto creado!");
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.toast.error(error.message);
      },
      complete: () => this.toast.info("complete")
    });
  }

  addUserToExpenseGroup() {
    let request = {
      userId: this.selectedUser.Id,
      expenseGroupId: this.defaultExpenseGroupId
    };
    this.expenseService.addUserToExpenseGroup(request).subscribe({
      next: (data) => {
        this.toast.success("Usuario añadido como amigo!");
        this.modalService.dismissAll();
      },
      error: (error) => {
        this.toast.error(error.message);
      },
      complete: () => this.toast.info("complete")
    });
    this.modalService.dismissAll();
  }

  openAddUser(content: any) {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data;
    });;
    this.modalService.open(content, { windowClass: 'add-user-modal', size: 'lg' });
  }

  openAddExpense(content: any) {
    this.expenseService.getExpenseGroupUsers(this.defaultExpenseGroupId).subscribe((data: any) => {
      this.users = data[0].User;
    });;
    this.modalService.open(content, { windowClass: 'add-expense-modal', size: 'lg' });
  }

  ngOnInit(): void {
    this.expenseService.getExpenses(this.defaultExpenseGroupId).subscribe((data: any) => {
      this.expenses = data;
    });;
  }

}
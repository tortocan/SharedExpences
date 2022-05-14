import { Component, OnInit } from '@angular/core';
import { ExpenseService, IExpense, IUser } from '../expense.service';
import moment from 'moment';
import 'moment/locale/es'  // without this line it didn't work
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  paymentAmount = new FormControl('', [
    Validators.required,
  ]);
  paymentDescription = new FormControl('', [
    Validators.required,
  ]);
  selectedUser = new FormControl({} as IUser, [
    Validators.required,
  ]);
  selectedUserTitle = "Selecionar un usuario";
  form: FormGroup;
  submitted = false;

  constructor(private expenseService: ExpenseService, private modalService: NgbModal, private userService: UserService, private toast: ToastService,private formBuilder: FormBuilder) {

  }

  selectUser(user: any) {
    this.selectedUser.setValue(user);
  }

  addExpense() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toast.warning("Formulario no valido!");
    }
    const expense: IExpense = {
      User: this.selectedUser.value,
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
      UserId: this.selectedUser.value.Id,
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
      userId: this.selectedUser.value.Id,
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
    this.form = this.formBuilder.group({
      paymentAmount: this.paymentAmount,
      selectedUser: this.selectedUser,
      paymentDescription: this.paymentDescription
    });
    this.expenseService.getExpenses(this.defaultExpenseGroupId).subscribe((data: any) => {
      this.expenses = data;
    });;
  }

  onSubmit(form: any) {
    console.log(form.value);
  }
}
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseService, IBalance, IBalanceSummary, IUser } from '../expense.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  defaultExpenseGroupId: number = 1;
  selectedUserTitle = "Selecionar un usuario";
  balanceSummary: IBalanceSummary = {
    Balance: [],
    BalanceDue: []
  } as IBalanceSummary;

  constructor(private expenseService: ExpenseService, private modalService: NgbModal,private userService: UserService) {
  }

  isPositiveBalance(balance: IBalance): boolean {
    return balance.Amount > 0;
  }

  ngOnInit(): void {
    let request = {
      expenseGroupId: this.defaultExpenseGroupId
    };
    this.expenseService.getExpenseGroupBalance(request).subscribe((data: any) => {
      this.balanceSummary = data;
    });;
  }

}

import { Injectable } from '@angular/core';

export interface IQueryParam {
  key: string;
  value: any;
}
export enum ServiceResource {
  Expenses,
  Balance,
  GetExpenseGroupUsers,
  AddUserToExpenseGroup,
  User,
  GetExpenseGroupBalance
}
@Injectable({
  providedIn: 'root'
})
export class QueryService {
  items: string[] = [];
  private srcValue: string = '';
  constructor() { }

  private camelize(s: string): string {
    return s.replace(/(?:^|[-_])(\w)/g, function (stripped, letter) {
      return letter ? letter.toUpperCase() : '';
    }).replace(/(^\w)/, function (letter) {
      return letter.toLowerCase();
    });
  }

  clear() {
    this.items = []
  }

  addOrUpdateQueryParam(queryParam: IQueryParam, appendToParam = false) {
    let oldParam = this.items.find(x => x.indexOf(queryParam.key) > -1);
    if (oldParam) {
      this.items = this.items.filter(x => x !== oldParam);
    }
    let newParam: string;
    if (appendToParam && !!oldParam) {
      oldParam = oldParam.split(',').filter(x => x !== queryParam.value).join(',');
      newParam = `${oldParam},${queryParam.value}`;
    } else {
      newParam = `${queryParam.key}=${queryParam.value}`;
    }
    this.items.push(newParam);
  }

  getUrl(baserUrl: string, urlResource: string) {
    return `${baserUrl}${urlResource}${this.items.length ? `?${this.items.map((value, i) => i === 0 ? value : `&${value}`).join('')}` : ''}`;
  }
  buildUrl(resource: any, resource2: any = undefined, baserUrl = 'http://localhost:4200/api/'): string {
    let urlResource = typeof (resource) === 'string'
      ? resource
      : this.camelize(ServiceResource[resource]);
    this.items = this.items.filter(x => !!x);
    if(resource2) {
      urlResource +=  "/";
      urlResource += typeof (resource2) === 'string'
      ? resource2
      : this.camelize(ServiceResource[resource2]);
    }
    this.srcValue = this.getUrl(baserUrl,urlResource);
    const url = this.srcValue;
    this.clear();
    return url;
  }
}

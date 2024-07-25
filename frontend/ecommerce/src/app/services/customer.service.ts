import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../common/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  saveCustomer(customer: Customer) {
    const customerUrl = 'http://localhost:8080/api/customers';

    return this.http.post<Customer>(customerUrl, customer);
  }
  login(customer: Customer) {
    const customerLoginUrl = 'http://localhost:8080/api/customers/login';
    return this.http.post<Customer>(customerLoginUrl, customer);
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  customerFormGroup: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.customerFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]],
      }),
    });
  }

  get email() {
    return this.customerFormGroup.get('customer.email');
  }

  get password() {
    return this.customerFormGroup.get('customer.password');
  }

  onSubmit() {
    if (this.customerFormGroup.invalid) {
      this.customerFormGroup.markAllAsTouched();
      return;
    }

    let customer = this.customerFormGroup.controls['customer'].value

    this.customerService.login(customer).subscribe((data) => {
      if (data != null) {
        alert('Login Successful')
        //storing values in storage
        this.authService.setFirstName(data.firstName);
        this.authService.setLastName(data.lastName);
        this.authService.setEmail(data.email);
        this.authService.setMobile(data.mobile.toString());
        //redirect to home page
        this.router.navigateByUrl('');
      } else {
        alert("Invalid Credentials")
      }
    })
  }
}
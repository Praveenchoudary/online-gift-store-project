import { Component } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State } from '../../common/state';
import { Country } from '../../common/country';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { CartItem } from '../../common/cart-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  checkoutFormGroup: FormGroup;

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalQuantity = 0;
  totalPrice = 0;

  constructor(private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private router: Router
  ) { }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data
    })
  }

  ngOnInit() {
    //calling cart review
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [
          sessionStorage.getItem('firstName'),
          [Validators.required, Validators.pattern('[A-Za-z]+')]],
        lastName: [
          sessionStorage.getItem('lastName'),
          [Validators.required, Validators.pattern('[A-Za-z]+')]],
        email: [
          sessionStorage.getItem('email'),
          [Validators.required, Validators.email]],
        mobile: [
          sessionStorage.getItem('mobile'),
          [Validators.required, Validators.pattern('[6-9][0-9]{9}')]],
      }),

      shippingAddress: this.formBuilder.group({
        street: ['',[Validators.required]],
        city: ['',[Validators.required]],
        state: ['',[Validators.required]],
        country: ['',[Validators.required]],
        zipCode: ['',[Validators.required, Validators.pattern('[0-9]{6}')]],
      }),

      billingAddress: this.formBuilder.group({
        street: ['',[Validators.required]],
        city: ['',[Validators.required]],
        state: ['',[Validators.required]],
        country: ['',[Validators.required]],
        zipCode: ['',[Validators.required, Validators.pattern('[0-9]{6}')]],
      }),
    });
    //populate countries
    this.checkoutService.getCountries().subscribe((data) => {
      this.countries = data;
      console.log(data);
    });

  }
  //getter methods for customer
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get mobile() {
    return this.checkoutFormGroup.get('customer.mobile');
  }
  //shipping address getter methods
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
 //billing address getter methods
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }


  copyShippingAddress(event: any) {
    if (event.target.checked) {
      //reading shippingAdderss form data
      const shippingAddressData = this.checkoutFormGroup?.get('shippingAddress')?.value;
      
      //assign shippingAddress form data to billingAddress form data
      this.checkoutFormGroup?.controls?.['billingAddress'].setValue(shippingAddressData);
      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls?.['billingAddress'].reset();
      //bug fix for states
      this.billingAddressStates = [];
    }
  }
  onSubmit() {
    console.log(this.checkoutFormGroup?.get('customer')?.value);
    console.log(this.checkoutFormGroup?.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup?.get('billingAddress')?.value);

    if (this.checkoutFormGroup.invalid) {
      alert('Form is Invalid');
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //creating order objects
    let order = new Order();
    order.totalPrice = this.totalPrice
    order.totalQuantity = this.totalQuantity

    //creating cart items
    let cartItems = this.cartService.cartItems;
  
    let orderItems: OrderItem[] = cartItems.map(
      (cartItem) => new OrderItem(cartItem)
    );
    
    //creating Purchase object
    let purchase = new Purchase();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value

    //shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );

    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    //caall rest api
    this.checkoutService.placeOrder(purchase).subscribe((data) => {
      alert(
        'Order Placed Successfully! Your order tracking  no: ' +
        data.orderTrackingNumber
      );
      //reset the cart
      this.cartService.cartItems = [];
      this.cartService.totalPrice.next(0);
      this.cartService.totalQuantity.next(0);
      this.cartService.totalQuantity.next(0);
      this.checkoutFormGroup.reset();

      //remove item from localStorage
      localStorage.clear();

      //redirecting to home page
      this.router.navigateByUrl('');
    });
  }


  getStates(formGroupName: string) {
    const FormGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = FormGroup?.value.country.code;
    const countryName = FormGroup?.value.country.name;

    this.checkoutService.getStates(countryCode).subscribe((data) => {
      if (formGroupName == 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      //select first item by default
      FormGroup?.get('state')?.setValue(data[0]);
    });
  
  }
}
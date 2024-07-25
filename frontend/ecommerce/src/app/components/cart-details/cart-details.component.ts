import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent {
  cartItems: CartItem[] = []
  
  totalPrice = 0
  totalQuantity = 0

  constructor(private cartService: CartService) { }
  
  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
    this.cartService.computeCartTotals();
  }
  ngOnInit() {
    this.listCartDetails();
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.incrementQuantity(theCartItem)
    //
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
    //
  }
  remove(theCartItem: CartItem) {
    if (confirm("Are you sure remove item from cart?")) {
      this.cartService.remove(theCartItem);
    }
    this.cartService.remove(theCartItem);
  }
}

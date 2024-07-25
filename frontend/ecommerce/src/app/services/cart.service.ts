import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = []
  
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //data will be available even browser window is close
  //storage:Storage = localStorage

  //Data will be cleared once the browser window is closed
  storage: Storage = localStorage;
  

  constructor() { 
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;
    }
    //compute totals based on the data that is read from storage
    this.computeCartTotals();
  }

  //adding cartItems to the storage
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartitem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartitem = this.cartItems.find(
        (tempCartitem) => tempCartitem.id === theCartItem.id
      );

      alreadyExistsInCart = existingCartitem != undefined;
    }

    if (alreadyExistsInCart) {
      //increment the quantity
      alert("product updated to cart")
      existingCartitem.quantity++;
    } else {
      //just add the item to the cartItems array
      alert("new product added to cart")
      this.cartItems.push(theCartItem);
    }

    //compute cart total and quantity
    this.computeCartTotals();
}
  computeCartTotals() {
    let totalPricevalue = 0;
    let totalQuantityValue = 0

    for (let currentCartItem of this.cartItems) {
      totalPricevalue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;

    }

    //publish new values
    this.totalPrice.next(totalPricevalue);
    this.totalQuantity.next(totalQuantityValue);

    //persist cart data
    this.persistCartItems();
    
   
  }

  remove(theCartItem: CartItem) {
    //get index of item from cartItems array
    const ItemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );

    //if found, remove the item
    if (ItemIndex > - 1) {
      this.cartItems.splice(ItemIndex, 1);

      //update total and cart price
      this.computeCartTotals();

    }

  }
  
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      //remove item from cart
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  incrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity++;
    this.computeCartTotals();
  }
}

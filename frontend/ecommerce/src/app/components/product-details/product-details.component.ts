import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: Product = new Product();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  addToCart(theProduct: Product) {

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
    ngOnInit(){
      this.route.paramMap.subscribe(() => {
        this.handleProductDetails();
      });
  }
  handleProductDetails() {
    const theProductIdId: any = this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(theProductIdId).subscribe((data) => {
      this.product = data;
    });
  }
}
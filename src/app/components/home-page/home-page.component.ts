import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/cart';
import { CartDetail } from 'src/app/common/CartDetail';
import { Customer } from 'src/app/common/Customer';
import { Rate } from 'src/app/common/Rate';
import { CartService } from 'src/app/services/cart.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProductService } from 'src/app/services/product.service';
import { RateService } from 'src/app/services/rate.service';
import { Product } from '../../common/Product';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  products!: any;
  productsF!: Product[];
  isLoading = true;

  rates!: Rate[];
  rateProduct!: Rate[];

  customerId!: number;
  user!: Customer;

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  totalCartItem!: number;

  totalLength!: number;
  page: number = 1;

  key: string = '';
  keyF: string = '';
  reverse: boolean = true;
  test: any;
  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private cartService: CartService,
    private rateService: RateService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.cartService.$data.subscribe((data) => {
      this.totalCartItem = data;
    });
    this.getAllRate();
    this.getAll();
    this.getUser();
  }

  getUser() {
    this.user = this.localStorageService.getUser();
    if (this.user != null) {
      this.customerId = this.user.userId;
    }
  }

  getAll() {
    this.productService.getAll().subscribe(
      (data) => {
        this.isLoading = false;
        this.products = data as Product[];
        this.productsF = this.products.map((product: Product) => {
          return {
            ...product,
            salePrice: product.price * (1 - product.discount / 100),
            salePriceAsc: product.price * (1 - product.discount / 100),
          };
        });
        this.test = this.productsF;
        console.log('eeeee', this.productsF);
        this.totalLength = this.products.length;
      },
      (error) => {
        this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
      }
    );
  }

  getAllRate() {
    this.rateService.getAll().subscribe(
      (data) => {
        this.rates = data as Rate[];
      },
      (error) => {
        this.toastr.error('Lỗi truy xuất dữ liệu! ' + error.status, 'Hệ thống');
      }
    );
  }

  getStar(id: number): number {
    //push la phai co 1 cai bien de ghi no moi duoc TT
    var length: number;
    this.rateProduct = [];
    for (const item of this.rates) {
      if (item.product.productId === id) {
        length = this.rateProduct.push(item);
      }
    }
    var star: number = 0;
    for (const item of this.rateProduct) {
      star += item.star;
    }
    if (this.rateProduct.length == 0) {
      return 0;
    }
    return star / this.rateProduct.length;
  }

  addCart(productId: number, price: number) {
    this.user = this.localStorageService.getUser();
    if (this.user != null) {
      this.customerId = this.user.userId;
      this.cartService.getCart(this.customerId).subscribe(
        (data) => {
          this.cart = data as Cart;
          this.cartDetail = new CartDetail(
            0,
            1,
            price,
            new Product(productId),
            new Cart(this.cart.id)
          );
          this.cartService.postDetail(this.cartDetail).subscribe(
            (data) => {
              this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
              this.cartService.getAllDetail(this.cart.id).subscribe((data) => {
                this.cartDetails = data as CartDetail[];
                this.cartService.setData(this.cartDetails.length);
              });
            },
            (error) => {
              this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
              this.router.navigate(['/home-page']);
              window.location.href = '/home-page';
            }
          );
        },
        (error) => {
          this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
          this.router.navigate(['/home-page']);
          window.location.href = '/home-page';
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    console.log('fValue', fValue);

    const fValueNoAccent = this.removeVietnameseAccents(fValue);

    this.productsF =
      fValue !== ''
        ? this.productsF.filter((p: any) => {
            const productNameNoAccent = this.removeVietnameseAccents(
              p.name.toLowerCase()
            );
            return productNameNoAccent.includes(fValueNoAccent.toLowerCase());
          })
        : this.test;
    // console.log(this.productsF);

    this.totalLength = this.productsF.length;
  }

  removeVietnameseAccents(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  sort(keyF: string) {
    if (keyF === 'enteredDate') {
      this.key = 'enteredDate';
      this.reverse = true;
    } else if (keyF === 'priceDesc') {
      this.key = 'salePrice';
      this.reverse = true;
    } else if (keyF === 'priceAsc') {
      this.key = 'salePriceAsc';
      this.reverse = false;
    } else {
      this.key = '';
      this.reverse = true;
    }
  }
}

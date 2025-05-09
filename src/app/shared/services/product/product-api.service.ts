import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ProductRes } from './product-api.consts';
import { LocalStorageManagerService } from '../local-storage/local-storage-manager.service';
import { STORAGE_PRODUCT_KEY } from '../local-storage/local-storage.consts';


@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private readonly AMAZON_API_BASE_URL = 'https://real-time-amazon-data.p.rapidapi.com';
  private readonly PRODUCTS_CATEGORY_ENDPOINT = `${this.AMAZON_API_BASE_URL}/products-by-category?category_id=281407&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE`;

  constructor(
    private http: HttpClient,
    private storageManager: LocalStorageManagerService
  ) { }


  private getProductsByCategory(): Observable<ProductRes> {
    return this.http.get<ProductRes>(this.PRODUCTS_CATEGORY_ENDPOINT);
  }

  getAdaptedProductsByCategory(): Observable<any> {
    return this.getProductsByCategory().pipe(
      map((response: ProductRes) => {
        return response.data.products.map((product, index) => ({
          id: index + 1,
          title: product.product_title,
          price: product.product_price,
          currency: product.currency,
          isPrime: product.is_prime
        }));
      }),
      tap(products => this.storageManager.save(STORAGE_PRODUCT_KEY, products))
    );
  }

}

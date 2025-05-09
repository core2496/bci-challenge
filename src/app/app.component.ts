import { Component, ViewChild } from '@angular/core';
import { ProductApiService } from './shared/services/product/product-api.service';
import { ProductAdapterRes } from './shared/services/product/product-api.consts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  productForm!: FormGroup;
  currencies = [
    { label: 'USD', value: 0 },
    { label: 'PEN', value: 1 },
  ];

  displayedColumns: string[] = [
    'id',
    'title',
    'price',
    'currency',
    'isPrime',
    'actions',
  ];
  dataSource = new MatTableDataSource<ProductAdapterRes>([]);

  currentId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productApiService: ProductApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getProductsByCategory();

    this.productForm = this.fb.group({
      title: ['', [Validators.required]],
      price: [0.0, [Validators.required, Validators.min(0.1)]],
      currency: [null, [Validators.required]],
      isPrime: [false],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  get titleControl() {
    return this.productForm.get('title');
  }
  get priceControl() {
    return this.productForm.get('price');
  }
  get currencyControl() {
    return this.productForm.get('currency');
  }

  getProductsByCategory(): void {
    this.productApiService
      .getAdaptedProductsByCategory()
      .subscribe((productAdapterRes: ProductAdapterRes[]) => {
        this.dataSource.data = productAdapterRes.reverse();
     
      });
  }
  getCurrencyLabel(value: number): string {
    const currency = this.currencies.find((c) => c.value === value);
    return currency ? currency.label : '';
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  private resetForm(): void {
    this.productForm.reset();

    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
        control.setErrors(null);
      }
    });
    this.currentId = null;
  }

  onSubmit(): void {
    if (!this.productForm.valid) return;

    const currentData = this.dataSource.data;
    this.currentId
      ? this.updateProduct(currentData)
      : this.createProduct(currentData);

    this.resetForm();
  }

  private updateProduct(currentData: ProductAdapterRes[]): void {
    const updatedData = currentData.map((item) =>
      item.id === this.currentId
        ? { ...this.productForm.value, id: this.currentId }
        : item
    );
    this.dataSource.data = updatedData;
    this.showNotification('Producto actualizado exitosamente');
  }

  private createProduct(currentData: ProductAdapterRes[]): void {
    const nextId = currentData.length > 0 ? currentData[0].id + 1 : 1;

    const newProduct: ProductAdapterRes = {
      ...this.productForm.value,
      id: nextId,
    };
    this.dataSource.data = [newProduct, ...currentData];
    this.showNotification('Producto registrado exitosamente');
  }

  onEdit(element: ProductAdapterRes): void {

    this.currentId = element.id;

    let currencyValue = element.currency;
    if (typeof element.currency === 'string') {
      currencyValue = element.currency === 'USD' ? '0' : '1';
    }

    let priceValue = element.price;
    if (typeof element.price === 'string') {
      priceValue = element.price.replace('$', '');
    }

    this.productForm.patchValue({
      title: element.title,
      price: Number(priceValue),
      currency: Number(currencyValue),
      isPrime: element.isPrime,
    });
  }

  onDelete(element: ProductAdapterRes): void {

    const index = this.dataSource.data.findIndex(
      (item) => item.id === element.id
    );

    if (index > -1) {
      const newData = [...this.dataSource.data];
      newData.splice(index, 1);
      this.dataSource.data = newData;
      this.showNotification('Producto eliminado exitosamente');
    }
  }

  onClear(): void {
    this.resetForm();
  }
}

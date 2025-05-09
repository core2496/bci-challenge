import { Component } from '@angular/core';
import { ProductApiService } from './shared/services/product/product-api.service';
import { ProductAdapterRes } from './shared/services/product/product-api.consts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private productApiService: ProductApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // this.getProductsByCategory();

    this.productForm = this.fb.group({
      title: ['', [Validators.required]],
      price: [0.0, [Validators.required, Validators.min(0)]],
      currency: [null, [Validators.required]],
      isPrime: [false],
    });
  }

  get titleControl() { return this.productForm.get('title'); }
  get priceControl() { return this.productForm.get('price'); }
  get currencyControl() { return this.productForm.get('currency'); }

  getProductsByCategory(): void {
    this.productApiService
      .getAdaptedProductsByCategory()
      .subscribe((productAdapterRes: ProductAdapterRes) => {
        console.log('productAdapterRes', productAdapterRes);
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
      panelClass: ['success-snackbar']
    });
  }
  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onSubmit() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
      const currentData = this.dataSource.data;

      if (this.currentId) {
        const updatedData = currentData.map(item => 
          item.id === this.currentId 
            ? { ...this.productForm.value, id: this.currentId }
            : item
        );
        this.dataSource.data = updatedData;
        this.showNotification('Producto actualizado exitosamente');
      } else {
        const nextId = currentData.length > 0 
          ? currentData[currentData.length - 1].id + 1 
          : 1;

        const newProduct: ProductAdapterRes = {
          ...this.productForm.value,
          id: nextId,
        };
        this.dataSource.data = [...currentData, newProduct];
        this.showNotification('Producto registrado exitosamente');

      }
      this.productForm.reset();
      this.currentId = null;
    } else{
      this.markFormGroupTouched(this.productForm);
    }
  }

  onEdit(element: ProductAdapterRes): void {
    console.log('Editando:', element);
    this.currentId = element.id;
    this.productForm.patchValue({
      title: element.title,
      price: element.price,
      currency: element.currency,
      isPrime: element.isPrime,
    });
  }

  onDelete(element: ProductAdapterRes): void {
    console.log('Eliminando:', element);
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
}

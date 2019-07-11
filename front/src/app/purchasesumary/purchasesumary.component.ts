import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';


@Component({
  selector: 'app-purchasesumary',
  templateUrl: './purchasesumary.component.html',
  styleUrls: ['./purchasesumary.component.scss']
})
export class PurchasesumaryComponent implements OnInit {

  public customer_name = "";
  public customer_surname = "";
  public customer_type_document = "";
  public customer_document = "";
  public customer_email = "";
  public customer_mobile = ""
  public loading = true;

  constructor(public service: ApirestService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private singleton: SingletonService,
    private route: ActivatedRoute) {
    let value = this.route.snapshot.params['param'];
    console.log(value);

  }

  ngOnInit() {


  }

  createOrder() {
    let validate = true;
    if (this.customer_name == '') {
      this.toastr.error('Debe diligenciar el campo nombre');
      validate = false;
    }

    if (this.customer_surname == '') {
      this.toastr.error('Debe diligenciar el campo apellido');
      validate = false;
    }

    if (this.customer_type_document == '') {
      this.toastr.error('Debe seleccionar un tipo de documento');
      validate = false;
    }

    if (this.customer_document == '') {
      this.toastr.error('Debe diligenciar el campo documento');
      validate = false;
    }

    if (this.customer_email == '') {
      this.toastr.error('Debe diligenciar el campo correo electrónico');
      validate = false;
    }

    if (this.customer_mobile == '') {
      this.toastr.error('Debe diligenciar el campo número teléfonico');
      validate = false;
    }

    if (validate) {
      this.loading = true;
      let body = new FormData();
      body.append('id', 0 + '');
      body.append('customer_name', this.customer_name);
      body.append('customer_surname', this.customer_surname);
      body.append('customer_type_document', this.customer_type_document);
      body.append('customer_document', this.customer_document);
      body.append('customer_email', this.customer_email);
      body.append('customer_mobile', this.customer_mobile);
      body.append('total_order', '4000000');
      body.append('iva_order', '19');
      body.append('total_with_iva', '4200000');
      body.append('currency', 'COP');
      body.append('product', 'Imac i5');
      body.append('description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit');

      this.service.queryPost('orders', body).subscribe(
        response => {
          this.loading = false;
          let result = response.json();

          if (result.success) {
            window.open(result.url, '_parent');
            //Show success message
            this.toastr.success(result.message, this.translate.instant('alerts.congratulations'));
          }
          else {
            this.toastr.error(result.message, 'Error');
          }
        },
        err => {
          this.loading = false;
          console.log(err);
        }
      );
    }
  }

}

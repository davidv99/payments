import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';


@Component({
  selector: 'app-transactionsumary',
  templateUrl: './transactionsumary.component.html',
  styleUrls: ['./transactionsumary.component.scss']
})
export class TransactionsumaryComponent implements OnInit {
  public idReserve = null;
  public sumaryOrder = {
    "id": '',
    "customer_name": '',
    "customer_surname": '',
    "customer_email": '',
    "customer_type_document": '',
    "customer_document": null,
    "customer_mobile": '',
    "product": '',
    "description": '',
    "total_order": '',
    "iva_order": '',
    "total_with_iva": '',
    "currency": '',
    "status": '',
    "request_id": '',
    "request_url": '',
  };
  public sumaryPaiment = {
    "bank_name": "",
    "payment_method": "",
    "authorization": "",
    "reference": "",
    "date": "",
    "message": "",
    "currency": "",
    "amount": ""
  }
  public resultStatus = null;

  public showPaymentButton = false;

  constructor(public service: ApirestService,
    private toastr: ToastrService,
    public singleton: SingletonService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.queryParams['4ere31'];
    console.log(id);
    this.findData(id);
  }


  findData(id) {
    this.service.queryGet('orders/' + id).subscribe(
      response => {

        let result = response.json();
        if (result) {
          this.idReserve = result.request_id;

          this.sumaryOrder = {
            "id": result.id,
            "customer_name": result.customer_name,
            "customer_surname": result.customer_surname,
            "customer_email": result.customer_email,
            "customer_type_document": result.customer_type_document,
            "customer_document": result.customer_document,
            "customer_mobile": result.customer_mobile,
            "product": result.product,
            "description": result.description,
            "total_order": result.total_order,
            "iva_order": result.iva_order,
            "total_with_iva": result.total_with_iva,
            "currency": result.currency,
            "status": result.status,
            "request_id": this.idReserve,
            "request_url": result.request_url,
          };

          this.getPaymentData();
        }
      },
      err => {

        console.log(err);
      }
    );

  }

  getPaymentData() {
    let body = new FormData();
    body.append('request_id', this.idReserve);

    this.service.queryPost('payments', body).subscribe(
      response => {

        let result = response.json();

        if (result.success) {
          this.resultStatus = result.trans_status;

          if (result.trans_status == 'PENDING') {
            this.toastr.warning(result.message);
            this.showPaymentButton = true;

          } else if (result.trans_status == 'SUCCESS') {
            this.toastr.success(result.message);

            this.updateOrderStatus('PAYED');
            this.sumaryPaiment = {
              "bank_name": result.sumary_transaction.bank_name,
              "payment_method": result.sumary_transaction.payment_method,
              "authorization": result.sumary_transaction.authorization,
              "reference": result.sumary_transaction.reference,
              "date": result.sumary_transaction.date,
              "message": result.sumary_transaction.message,
              "currency": result.sumary_transaction.currency,
              "amount": result.sumary_transaction.amount
            }

          }

        } else {
          this.toastr.error(result.message);
          this.updateOrderStatus('REJECTED”');
        }

      },
      err => {

        console.log(err);
      }
    );
  }


  payment() {
    window.open(this.sumaryOrder.request_url, '_parent');
  }

  updateOrderStatus(status) {

    let body = new FormData();
    body.append('id', this.sumaryOrder.id);
    body.append('status', status);

    this.service.queryPost('orders/update', body).subscribe(
      response => {

        let result = response.json();

        if (result.status) {
          this.toastr.success(result.message);
        }

      },
      err => {

        console.log(err);
      }
    );

  }
}

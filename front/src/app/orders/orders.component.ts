import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  //Variables for orders list with (pagination, select rows, search)
  public orders = [];
  public pagesNumber = 10; //Default value
  public search = '';
  public pages = [];
  public currentPage = 1;

  constructor(
    public service: ApirestService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private singleton: SingletonService
  ) { }

  ngOnInit() {
    this.getOrders('')
  }

  getOrders(page) {
    let url = 'orders?rows=' + this.pagesNumber;
    url += '&search=' + this.search;

    if (page != '') {
      url += '&page=' + page;
    }

    this.service.queryGet(url).subscribe(
      response => {
        let result = response.json();
        this.orders = result.data;

        this.currentPage = result['current_page'];
        this.pages = this.singleton.pagination(result);
      },
      err => {
        console.log(err);
      }
    );
  }

}

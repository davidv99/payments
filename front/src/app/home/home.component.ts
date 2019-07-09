import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  //@Input() search: string;

  public sessionUser = null;

  //Form variables
  public user = {
    id: 0,
    name: '',
    email: '',
    password: '',
    status: true,
    role_id: '',
  };
  public roles = [];

  //Variables for users list with (pagination, select rows, search)
  public users = [];
  public pagesNumber = 10; //Default value
  public search = '';
  public pages = [];
  public currentPage = 1;

  public productsList = [];

  constructor(
    public service: ApirestService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private singleton: SingletonService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['filter'] != undefined) {
        this.search = params['filter'];
      } else if (params['filter'] == '') {
        this.search = '';
      }
      this.getProductsList('');
    });
  }

  ngOnInit() {
    this.getProductsList('');
  }

  getProductsList(page) {
    let url = 'products?rows=' + this.pagesNumber;
    url += '&search=' + this.search;

    if (page != '') {
      url += '&page=' + page;
    }

    this.service.queryGet(url).subscribe(
      (response) => {
        let result = response.json();
        this.productsList = result.data;

        this.currentPage = result['current_page'];
        this.pages = this.singleton.pagination(result);
      },
      (err) => {
        console.log(err);
      },
    );
  }
}

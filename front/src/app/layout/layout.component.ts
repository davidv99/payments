import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  private user = {};
  private showCanvasLeft = false;
  private showCanvasRight = false;
  private menuXs = true;
  private showOverlay = false;
  private mediaQuery = 'lg';
  private logged = false;

  //Variables for users list with (pagination, select rows, search)
  private donations = [];
  private pagesNumber = 10; //Default value
  private search = '';
  private pages = [];
  private currentPage = 1;

  @Output() typed = new EventEmitter();

  constructor(
    private translate: TranslateService,
    public service: ApirestService,
    private router: Router,
    private singleton: SingletonService,
  ) {}

  getDonations(page) {
    if (this.search != '') {
      //this.router.navigate(['donations/search-result'], { queryParams: { filter: this.search } });
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    if (
      null == localStorage.getItem('token') ||
      'null' == localStorage.getItem('token') ||
      undefined == localStorage.getItem('token')
    ) {
      this.router.navigate(['/']);
    } else {
      this.getUser();
      this.logged = true;
    }

    this.getMediaQuery();
  }

  getMediaQuery() {
    let width = screen.width;

    if (width <= 575.98) {
      this.mediaQuery = 'xs';
      this.menuXs = true;
    } else if (width <= 767.98) {
      this.mediaQuery = 'sm';
      this.menuXs = true;
    } else if (width <= 991.98) {
      this.mediaQuery = 'md';
    } else if (width <= 1199.98) {
      this.mediaQuery = 'lg';
    }
  }

  /**
   *  It gets the user from the local storage
   **/
  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.translate.use(this.user['language']);
  }

  /**
   * Logout from api and redirect to login
   */
  logout() {
    let body = new FormData();

    this.service.queryPost('logout', body).subscribe(
      (response) => {
        localStorage.setItem('user', null);
        localStorage.setItem('token', null);

        this.router.navigate(['/']);
      },
      (err) => {
        console.log(err);
        console.log(err['status']);
        if (err['status'] == 401) {
          localStorage.setItem('user', null);
          localStorage.setItem('token', null);

          this.router.navigate(['/']);
        }
      },
    );
  }

  openCanvas(canvas) {
    if (canvas == 'left') {
      this.showCanvasLeft = true;
      this.showOverlay = true;
    } else if (canvas == 'right') {
      this.showCanvasRight = true;
      this.showOverlay = true;
    }
  }

  closeCanvas() {
    if (this.showCanvasLeft) {
      this.showCanvasLeft = false;
      this.showOverlay = false;
    } else {
      this.showCanvasRight = false;
      this.showOverlay = false;
    }
  }
}

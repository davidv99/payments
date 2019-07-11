import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  private id;
  private name;

  private detailsDonation = { id: 0, category_id: 0, user_id: 0, status: '', title: '', description: '', principal_image: '', value: '' };
  constructor(public service: ApirestService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private singleton: SingletonService,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['param'];
    this.name = this.route.snapshot.params['value'];
    this.viewDonation(this.id);
  }

  ngOnInit() {
  }


  viewDonation(id) {

  }
}

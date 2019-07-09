import { Component, OnInit } from '@angular/core';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

	private id;
	private name;

	private detailsDonation = {id: 0, category_id: 0, user_id: 0,status : '', title: '', description: '', principal_image: '', value: ''}; 
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


  viewDonation(id){
  	this.service.queryGet('products/'+id).subscribe(
            response=>
            {      
                let result = response.json(); 
                this.detailsDonation['id'] = result.id;
                this.detailsDonation['category_id'] = result.category_id;
                this.detailsDonation['user_id'] = result.user_id;
                this.detailsDonation['title'] = result.title;
                this.detailsDonation['description'] = result.description;
                this.detailsDonation['principal_image'] = result.principal_image;
                this.detailsDonation['value'] = result.value;
                this.detailsDonation['status'] = result.status;
            },
            err => 
            {
                console.log(err);
            }
        );
  }
}

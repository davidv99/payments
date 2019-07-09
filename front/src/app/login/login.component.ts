import { Component, OnInit } from '@angular/core';
import { ApirestService } from '../apirest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	private user = {email: '', password: ''};

  	constructor(public service: ApirestService,
  				private router: Router) 
  	{ 

  	}

  	ngOnInit() 
  	{
        console.log(localStorage.getItem('token'));
  		if('null' != localStorage.getItem('token') && null != localStorage.getItem('token') && undefined != localStorage.getItem('token'))
  		{
  			this.router.navigate(['/']);
  		}
  	}

  	login()
  	{
  		let body = new FormData;
  		body.append('email', this.user.email);
  		body.append('password', this.user.password);

  		this.service.queryPostRegular('login', body).subscribe(
            response=>
            {      
                let result = response.json(); 
                if(result.success) 
                {
                    let token = 'Bearer '+ result.token ; 
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    this.router.navigate(['/']);
                }
                else
                {
                 	console.log(result.message);
                }
            },
            err => 
            {
            	console.log(err);
            }
        );
  	}
}

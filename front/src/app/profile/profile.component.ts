import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApirestService } from '../apirest.service';
import { SingletonService } from '../singleton.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	private user = {};
	private imageChangedEvent: any = '';
	private croppedImage: any = '';
	private cropperReady = false;

	private sessionUser = null;

    //Variables for donations list with (pagination, select rows, search)
    private pagesNumber = 10; //Default value
    private search = '';
    private pages = [];
    private currentPage = 1;

    private donationsList = [];

	private information = "";
	private form = "hidde";
  	constructor(private translate: TranslateService,
                public service: ApirestService,
                public singleton: SingletonService,
                private toastr: ToastrService) 
  	{

  	}

  	ngOnInit() 
  	{
  		this.getUser();
  		this.getMyDonations();
  	}

  	getMyDonations(){
  		let url = 'products-user'
		this.service.queryGet(url).subscribe(
			response=>
			{      
			  let result = response.json(); 
			  this.donationsList = result;

			  this.currentPage = result['current_page'];
			  this.pages = this.singleton.pagination(result);
			},
			err => 
			{
			  console.log(err);
			}
		);
  	}
  	/**
  	*  It gets the user from the local storage
  	**/
  	getUser()
  	{
  		this.user = JSON.parse(localStorage.getItem('user'));
  		this.user['password'] = '';
  		this.user['confirm_password'] = '';
  	}

  	fileChangeEvent(event: any): void 
  	{
    	this.imageChangedEvent = event;
	}

	imageCropped(image: string) 
	{
	    this.croppedImage = image;
	}

	imageLoaded() 
	{
	    this.cropperReady = true;
	}

	loadImageFailed() 
	{
	    // show message
	}

	uploadImage()
	{
		document.getElementById('upload-image').click();
	}

	/**
	 * Saves the user profile
	 */
	saveProfile()
	{
		var body = new FormData();

		if('' != this.croppedImage)
		{
			var block = this.croppedImage.split(";");
			// Get the content type of the image
			var contentType = block[0].split(":")[1];// In this case "image/gif"
			// get the real base64 content of the file
			var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

			// Convert it to a blob to upload
			var blob = this.singleton.b64toBlob(realData, contentType);

			// Create a FormData and append the file with "image" as parameter name
			body.append("image", blob, 'image.jpg');
		}

		body.append('name', this.user['name']);
		body.append('email', this.user['email']);
		body.append('password', this.user['password']);
		body.append('confirm_password', this.user['confirm_password']);

		this.service.queryPost('update-profile', body).subscribe(
            response=>
            {      
                let result = response.json(); 

                if(result.success)
                {
                	this.user = result.user;
                	localStorage.setItem('user', JSON.stringify(result.user));
                	this.imageChangedEvent = '';
					this.croppedImage = '';
					this.cropperReady = false;
                    //Show success message
                    this.toastr.success(result.message, this.translate.instant('alerts.congratulations'));
                }
                else
                {
                    let message = '';
                    if(result.message.length > 0)
                    {
                        result.message.forEach(function(element) {
                            message += element+'<br>';
                        });
                    }

                    this.toastr.error(message, 'Error', {enableHtml: true, positionClass: 'toast-top-center'});
                }
            },
            err => 
            {
                console.log(err);
            }
        );
	}

	/**
	 * Cancel the cropped image
	 */
	cancelUpload()
	{
		this.imageChangedEvent = '';
		this.croppedImage = '';
		this.cropperReady = false;
	}

	changeView(){
		this.form = "";
		this.information = "hidde";
	}

	returnInfo(){
		this.information = "";
		this.form = "hidde";
	}
}

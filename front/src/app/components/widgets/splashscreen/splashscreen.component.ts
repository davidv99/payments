import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from 'src/app/services/general/utilities.service';
@Component({
    selector: 'app-splashscreen',
    templateUrl: './splashscreen.component.html',
    styleUrls: ['./splashscreen.component.scss']
})
export class SplashscreenComponent implements OnInit {

    public welcome;

    @Input() loader: boolean = false;

    constructor(
        private ut: UtilitiesService,
    ) { }

    ngOnInit() {
        const errorsSubs = this.ut._toggleSplashscreen.subscribe(res => {
        this.loader = res;
          if(res){
            this.welcome = 'Cargando, por favor espera';
          }
        });
        

    }

}

import { Component, ViewEncapsulation } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  	title = 'app';

  	constructor(private translate: TranslateService) 
    {
        translate.setDefaultLang('es');
        translate.use('es');
    }

    useLanguage(language: string) 
    {
        this.translate.use(language);
    }
}

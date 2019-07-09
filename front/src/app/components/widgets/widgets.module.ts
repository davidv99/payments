import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmComponent } from './confirm/confirm.component';
import { ErrorsComponent } from './errors/errors.component';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule.forChild()],
  declarations: [
    SplashscreenComponent,
    ErrorsComponent,
    ConfirmComponent,
  ],
  exports: [SplashscreenComponent, ErrorsComponent, ConfirmComponent],
})
export class WidgetsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LogInComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    LogInComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    LogInComponent,
    SignUpComponent
  ]
})
export class AuthModule {

}

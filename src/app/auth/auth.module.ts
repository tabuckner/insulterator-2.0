import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LogInComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LogInComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AuthRoutingModule
  ],
})
export class AuthModule {

}

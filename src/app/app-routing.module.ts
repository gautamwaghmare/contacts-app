import { SignupComponent } from './auth/signup/signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'create', component: ContactCreateComponent, canActivate:[AuthGuard] },
  { path: 'edit/:contactId', component: ContactCreateComponent, canActivate:[AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component:SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

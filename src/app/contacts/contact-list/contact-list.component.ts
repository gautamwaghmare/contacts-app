import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { ContactsService } from './../contacts.service';
import { AuthService } from './../../auth/auth.service';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {

  contacts : Contact[] = [];
  isLoading = false;
  totalContacts = 0;
  contactsPerPage = 5;
  currentPage = 1
  pageSizeOptions = [1, 2, 5, 10];
  isAuthenticated = false;
  userId: string;
  private contactsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(private contactsService : ContactsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.contactsService.getContacts(this.contactsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.contactsSub = this.contactsService.getContactUpdateListner()
      .subscribe((contactsData : {contacts: Contact[], contactsCount: number
      }) => {
        this.isLoading = false;
        this.contacts = contactsData.contacts;
        this.totalContacts = contactsData.contactsCount;
      });
      this.isAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListner()
        .subscribe(isAuthenticated => {
          this.isAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
  }

  onDelete(_id: string){
    this.isLoading = true;
    this.contactsService.deleteContact(_id)
      .subscribe(() => {
        this.contactsService.getContacts(this.contactsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false
      });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.contactsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.contactsService.getContacts(this.contactsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.contactsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}

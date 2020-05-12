import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { environment } from './../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/contacts/";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http : HttpClient, private router : Router) { }

  private contacts : Contact[] = [];
  private contactsUpdated = new Subject<{contacts: Contact[], contactsCount: number}>();

  getContacts(contactPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${contactPerPage}&page=${currentPage}`;
    this.http.get<{message:string, contacts:Contact[], contactsCount: number}>(BACKEND_URL + queryParams)
      .subscribe((contactsData) => {
        this.contacts = contactsData.contacts;
        this.contactsUpdated.next({contacts: [...this.contacts], contactsCount: contactsData.contactsCount});
      });
  }

  getContact(_id: string){
    return this.http.get<Contact>(BACKEND_URL + _id);
  }

  getContactUpdateListner(){
    return this.contactsUpdated.asObservable();
  }

  addContact(contact:Contact, imageFile: File){
    const fd = new FormData();
    fd.append('firstName', contact.firstName);
    fd.append('lastName', contact.lastName);
    fd.append('contactNumber', contact.contactNumber.toString());
    fd.append('email', contact.email);
    fd.append('status', (contact.status ? '1' : '0'));
    fd.append('address', contact.address);
    if(imageFile){
      fd.append('image', imageFile, contact.firstName+contact.lastName);
    }
    this.http.post<{message: string, contactId: string}>(BACKEND_URL, fd)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateContact(contact: Contact, imageFile: File | string){
    let fd: Contact | FormData;
    if(typeof(imageFile) === 'object'){
      fd = new FormData();
      fd.append('_id', contact._id);
      fd.append('firstName', contact.firstName);
      fd.append('lastName', contact.lastName);
      fd.append('contactNumber', contact.contactNumber.toString());
      fd.append('email', contact.email);
      fd.append('status', (contact.status ? '1' : '0'));
      fd.append('address', contact.address);
      fd.append('image', imageFile, contact.firstName+contact.lastName);
    } else {
      fd = {
        ...contact,
        imagePath: imageFile
      }
    }
    this.http.put(BACKEND_URL + contact._id, fd)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deleteContact(_id: string){
    return this.http.delete<{message:string}>(BACKEND_URL + _id);
  }
}

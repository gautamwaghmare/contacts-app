import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Contact } from './../contact.model';
import { ContactsService } from './../contacts.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit, OnDestroy {

  contact: Contact;
  isLoading = false;
  imagePreview: any;
  imageFile: File;
  private mode = 'create';
  private contactId: string;
  private authStatusSub: Subscription;

  constructor(private contactsService : ContactsService, private route : ActivatedRoute, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListner()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('contactId')){
        this.mode = 'edit';
        this.contactId = paramMap.get('contactId');
        this.isLoading = true;
        this.contactsService.getContact(this.contactId)
          .subscribe(contact => {
            this.isLoading = false;
            this.contact = contact;
            this.imagePreview = contact.imagePath;
          });
      } else {
        this.mode = 'create';
        this.contactId = null;
      }
    });
  }

  onSaveContact(contactForm : NgForm){
    if(contactForm.invalid){
      return;
    }
    this.isLoading = true;
    const contact : Contact ={...contactForm.value};
    contact._id = this.contactId
    if(this.mode === 'create'){
      this.contactsService.addContact(contact, this.imageFile);
    } else {
      this.contactsService.updateContact(contact, (this.imageFile ? this.imageFile : this.imagePreview));
    } 
    contactForm.resetForm();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const allowedExtensions = /(\.jpg|\jpeg|\.png|\.gif)$/i;
    if(!allowedExtensions.exec(file.name)){
      this.snackBar.open("Plese select image only!", "OK", {
        duration:10000
      })
      return;
    }else {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}

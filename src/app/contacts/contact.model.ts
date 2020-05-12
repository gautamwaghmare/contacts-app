export interface Contact {
    _id : string,
    firstName : string;
    lastName : string;
    email : string;
    contactNumber : number;
    status : boolean;
    creator: string;
    address?: string;
    imagePath?: string;
}
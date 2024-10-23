export class User {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  email: string;

  constructor(obj?: User) {
    this.id = obj?.id || '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj?.birthDate;
    this.street = obj ? obj.street : '';
    this.city = obj ? obj.city : '';
    this.postalCode = obj ? obj.postalCode : '';
    this.email = obj ? obj.email : '';
    this.houseNumber = obj ? obj.houseNumber : '';
  }
}

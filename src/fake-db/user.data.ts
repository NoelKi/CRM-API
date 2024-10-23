import { User } from '../models/user.model';

export const users: User[] = [
  new User({
    id: '0',
    firstName: 'Kieran',
    lastName: 'Mai',
    birthDate: new Date('2024-10-16T22:00:00.000Z'),
    street: '',
    houseNumber: '',
    city: 'Berlin',
    postalCode: '12161',
    email: 'kieran.noel@icloud.com'
  }),
  new User({
    id: '1',
    firstName: 'Amadeus',
    lastName: 'Scherkenbach',
    birthDate: new Date('2024-10-16T22:00:00.000Z'),
    street: 'Ostpreusendamm',
    houseNumber: '43',
    city: 'Berlin',
    postalCode: '12207',
    email: 'amadeus@sorglosinterent.de'
  })
];

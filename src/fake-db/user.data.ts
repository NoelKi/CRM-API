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
    email: 'kieran.noel@icloud.com',
    profilPicSrc: './assets/img/logos/file.png'
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
    email: 'amadeus@sorglosinterent.de',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '2',
    firstName: 'Emma',
    lastName: 'Schmidt',
    birthDate: new Date('1990-05-14T22:00:00.000Z'),
    street: 'Müllerstraße',
    houseNumber: '17',
    city: 'Hamburg',
    postalCode: '22081',
    email: 'emma.schmidt@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '3',
    firstName: 'Lukas',
    lastName: 'Fischer',
    birthDate: new Date('1988-08-21T22:00:00.000Z'),
    street: 'Bergstraße',
    houseNumber: '9',
    city: 'Munich',
    postalCode: '80331',
    email: 'lukas.fischer@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '4',
    firstName: 'Sophie',
    lastName: 'Weber',
    birthDate: new Date('1992-03-10T22:00:00.000Z'),
    street: 'Hauptstraße',
    houseNumber: '42',
    city: 'Frankfurt',
    postalCode: '60313',
    email: 'sophie.weber@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '5',
    firstName: 'Max',
    lastName: 'Müller',
    birthDate: new Date('1985-12-01T22:00:00.000Z'),
    street: 'Bahnhofstraße',
    houseNumber: '58',
    city: 'Cologne',
    postalCode: '50667',
    email: 'max.mueller@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '6',
    firstName: 'Leonie',
    lastName: 'Keller',
    birthDate: new Date('1996-07-23T22:00:00.000Z'),
    street: 'Schillerstraße',
    houseNumber: '5',
    city: 'Stuttgart',
    postalCode: '70178',
    email: 'leonie.keller@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '7',
    firstName: 'Tim',
    lastName: 'Brandt',
    birthDate: new Date('1999-09-17T22:00:00.000Z'),
    street: 'Goethestraße',
    houseNumber: '12',
    city: 'Düsseldorf',
    postalCode: '40210',
    email: 'tim.brandt@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '8',
    firstName: 'Maya',
    lastName: 'Schneider',
    birthDate: new Date('1991-11-29T22:00:00.000Z'),
    street: 'Blumenstraße',
    houseNumber: '23',
    city: 'Bremen',
    postalCode: '28195',
    email: 'maya.schneider@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  }),
  new User({
    id: '9',
    firstName: 'Finn',
    lastName: 'Neumann',
    birthDate: new Date('1994-06-18T22:00:00.000Z'),
    street: 'Lindenstraße',
    houseNumber: '30',
    city: 'Hanover',
    postalCode: '30159',
    email: 'finn.neumann@example.com',
    profilPicSrc: './assets/img/logos/file.png'
  })
];
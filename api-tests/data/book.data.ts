// data/book.data.ts

import { faker } from '@faker-js/faker';

/* Generates a valid new book object with realistic data.  */
export const generateBook = () => {
  return {
    name: faker.lorem.words(3),
    author: faker.person.fullName(),
    published_year: faker.date.past({ years: 30 }).getFullYear(),
    book_summary: faker.lorem.sentences(2)
  };
};

/* Generates an updated version of a book with new values. */
export const generateUpdatedBook = () => {
  return {
    name: faker.lorem.words(4),
    author: faker.person.fullName(),
    published_year: faker.date.past({ years: 5 }).getFullYear(),
    book_summary: faker.lorem.sentences(3)
  };
};

import { faker } from '@faker-js/faker';

export type User = {
  id: string;
  username: string;
  email: string;
  message: string;
};

const users: User[] = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  message: faker.lorem.sentence()
}));

export function getRandomUser(): User {
  const index = Math.floor(Math.random() * users.length);
  return users[index];
}

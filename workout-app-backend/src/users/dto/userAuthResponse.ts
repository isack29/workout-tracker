import { State } from '@prisma/client';

export class UserAuthResponse {
  id: string;
  name: string;
  email: string;
  state: State;
  accessToken: string;
}

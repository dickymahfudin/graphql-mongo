import { Request, Response } from 'express';
import { UserSchema } from '../schema/UserSchema';

interface Context {
  req: Request;
  res: Response;
  user: UserSchema | null;
}

export default Context;

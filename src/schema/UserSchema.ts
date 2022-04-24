import { getModelForClass, prop, pre, ReturnModelType, index, queryMethod } from '@typegoose/typegoose';
import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType, ObjectType } from 'type-graphql';
import bcrypt from 'bcrypt';
import { AsQueryMethod } from '@typegoose/typegoose/lib/types';

function findByEmail(this: ReturnModelType<typeof UserSchema, QueryHelpers>, email: UserSchema['email']) {
  return this.findOne({ email });
}

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>;
}

@pre<UserSchema>('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
})
@index({ email: 1 })
@queryMethod(findByEmail)
@ObjectType()
export class UserSchema {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;
}

// export const UserModel = getModelForClass(UserSchema, { options: { customName: 'users' } });
export const UserModel = getModelForClass<typeof UserSchema, QueryHelpers>(UserSchema, {
  options: { customName: 'users' },
});

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, { message: 'Password Must be at least 6 characters long' })
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { resolvers } from './resolvers';
import { connectDatabase } from './database';
import { verifyJwt } from './utils/jwt';
import { UserSchema } from './schema/UserSchema';
import Context from './types/context';

const bootstrap = async () => {
  const schema = await buildSchema({ resolvers });
  const port = process.env.PORT ?? 4000;

  const app = express();
  app.use(cookieParser());

  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;
      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<UserSchema>(ctx.req.cookies.accessToken);
        context.user = user;
      }
      return ctx;
    },
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  app.listen(port, () => console.log(`Server Running on: http://localhost:${port}`));
  connectDatabase();
};

bootstrap();

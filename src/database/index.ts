import mongoose from 'mongoose';
import config from 'config';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.get('dbUri'));
    console.info('Connected to Database');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

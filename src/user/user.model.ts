import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  adress: { type: String, required: true },
  profilePicture: { type: String, required: true },
  password: { type: String, required: true },
});

export interface User extends mongoose.Document {
  name: string;
  lastName: string;
  adress: string;
  profilePicture: string;
  password: string;
}

import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  profilePicture: { type: String },
  password: { type: String, required: true },
});

export interface User extends mongoose.Document {
  name: string;
  lastName: string;
  address: string;
  profilePicture?: string;
  password: string;
}

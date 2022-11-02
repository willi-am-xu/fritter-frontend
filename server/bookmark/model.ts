import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type { Freet } from '../freet/model';

/**
 * This file defines the properties stored in a Bundle
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Bundle on the backend
export type Bundle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  bundleName: string;
  freets: Array<Types.ObjectId>;
  dateCreated: Date;
  dateModified: Date;
};

export type PopulatedBundle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  bundleName: string;
  freets: Array<Freet>;
  dateCreated: Date;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bundles stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BundleSchema = new Schema<Bundle>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  bundleName: {
    type: String,
    required: true
  },
  freets: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }],
  dateCreated: {
    type: Date,
    required: true
  },
  dateModified: {
    type: Date,
    required: true
  },
});

const BundleModel = model<Bundle>('Bundle', BundleSchema);
export default BundleModel;

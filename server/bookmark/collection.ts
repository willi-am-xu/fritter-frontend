import type {HydratedDocument, Types} from 'mongoose';
import mongoose from 'mongoose';
import type {Bundle} from './model';
import BundleModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class BundleCollection {
  /**
   * Add a bundle to the collection
   *
   * @param {string} authorId - The id of the author of the bundle
   * @param {string} freetId - The id of the freet to add
   * @param {string} bundleName - The name of the bundle to be updated
   * @return {Promise<HydratedDocument<Bundle>>} - The newly created bundle
   */
  static async addOne(authorId: Types.ObjectId | string, freetId: string, bundleName: string): Promise<HydratedDocument<Bundle>> {
    const date = new Date();
    const bundle = new BundleModel({
      authorId,
      bundleName,
      freets: [freetId],
      dateCreated: date,
      dateModified: date
    });
    await bundle.save(); // Saves freet to MongoDB
    return (await bundle.populate('authorId')).populate('freets');
  }

  /**
   * Find a bundle by bundleId
   *
   * @param {string} bundleId - The id of the bundle to find
   * @return {Promise<HydratedDocument<Bundle>> | Promise<null> } - The bundle with the given bundleId, if any
   */
  static async findOne(bundleId: Types.ObjectId | string): Promise<HydratedDocument<Bundle>> {
    return (await BundleModel.findOne({_id: bundleId}).populate('authorId'))?.populate('freets');
  }

   /**
   * Find a bundle by bundleName
   * 
   * @param {string} authorId - The id of the author of the bundle
   * @param {string} bundleName - The name of the bundle to find
   * @return {Promise<HydratedDocument<Bundle>> | Promise<null> } - The bundle with the given bundleId, if any
   */
    static async findOneByName(authorId: Types.ObjectId | string, bundleName: string): Promise<HydratedDocument<Bundle>> {
      const unpop = await BundleModel.findOne({authorId, bundleName});
      if (unpop) {
        return (await unpop.populate('authorId')).populate('freets');
      }
      return unpop;
    }

  /**
   * Get all the bundles in the database
   *
   * @return {Promise<HydratedDocument<Bundle>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Bundle>>> {
    // Retrieves freets and sorts them from most to least recent
    return BundleModel.find({}).sort({dateModified: -1}).populate('authorId').populate('freets');
  }

  /**
   * Get all the bundles in by given author
   *
   * @param {string} authorId - The id of the author of the bundles
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the bundles
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Bundle>>> {
    const author = await UserCollection.findOneByUsername(username);
    return BundleModel.find({authorId: author._id}).populate('authorId').populate('freets');
  }

  /**
   * Add to a bundle with a new freet
   * 
   * @param {string} authorId - The id of the author of the bundle
   * @param {string} bundleName - The name of the bundle to be updated
   * @param {string} freetId - The id of the freet to be added
   * @return {Promise<HydratedDocument<Bundle>>} - The newly updated bundle
   */
  static async addOneFreet(authorId: Types.ObjectId | string, bundleName: string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Bundle>> {
    const bundle = await BundleModel.findOne({authorId, bundleName});
    bundle.freets.push(new mongoose.Types.ObjectId(freetId));
    bundle.dateModified = new Date();
    await bundle.save();
    return (await bundle.populate('authorId')).populate('freets');
  }

  /**
   * Remove a freet from a bundle
   *
   * @param {string} authorId - The id of the author of the bundle
   * @param {string} bundleName - The name of the bundle to be updated
   * @param {string} freetId - The id of the freet to be removed
   * @return {Promise<HydratedDocument<Bundle>>} - The newly updated bundle
   */
     static async removeOneFreet(authorId: Types.ObjectId | string, bundleName: string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Bundle>> {
      const bundle = await BundleModel.findOne({authorId, bundleName});
      bundle.freets = bundle.freets.filter((freet)=>freet.toString()!==freetId.toString());
      bundle.dateModified = new Date();
      await bundle.save();
      return (await bundle.populate('authorId')).populate('freets');
    }

  /**
   * Delete a bundle with given bundleName.
   *
   * @param {string} authorId - The id of the author of the bundle
   * @param {string} bundleName - The name of bundle to delete
   * @return {Promise<Boolean>} - true if the bundle has been deleted, false otherwise
   */
  static async deleteOne(authorId: Types.ObjectId | string, bundleName: string,): Promise<boolean> {
    const bundle = await BundleModel.deleteOne({authorId, bundleName});
    return bundle !== null;
  }

  /**
   * Delete all the bundles by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await BundleModel.deleteMany({authorId});
  }
}

export default BundleCollection;

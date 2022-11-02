import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BundleCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as bundleValidator from '../bookmark/middleware'
import * as util from './util';

const router = express.Router();

/**
 * Get all the bookmark bundles.
 *
 * @name GET /api/bookmark
 *
 * @return {BundleResponse[]} - A list of all the bundles sorted in descending
 *                      order by date modified
 */
/**
 * Get bundle by author.
 *
 * @name GET /api/bookmark?authorId=id
 *
 * @return {BundleResponse[]} - An array of bundles created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if authorId query parameter was supplied
      if (req.query.author !== undefined) {
        next();
        return;
      }
  
      const allBundles = await BundleCollection.findAll();
      const response = allBundles.map(util.constructBundleResponse);
      res.status(200).json(response);
    },
    [
      userValidator.isAuthorExists
    ],
    async (req: Request, res: Response) => {
      const authorBundles = await BundleCollection.findAllByUsername(req.query.author as string);
      const response = authorBundles.map(util.constructBundleResponse);
      res.status(200).json(response);
    }
  );

  /**
 * Create a new bundle and add freet.
 *
 * @name POST /api/bookmark/:bundleName?/:freetId?
 *
 * @param {string} bundleName - The name of the bundle to create
 * @param {string} freetId - The id of the freet to add
 * @return {BundleResponse} - The created bundle
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the bundle name is invalid
 */
router.post(
    '/:bundleName?/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      bundleValidator.isValidBundleName
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const bundle = await BundleCollection.addOne(userId, req.params.freetId, req.params.bundleName);
  
      res.status(201).json({
        message: 'Your bundle was created successfully.',
        bundle: util.constructBundleResponse(bundle)
      });
    }
  );

  /**
 * Add a freet to a bundle.
 *
 * @name PATCH /api/bookmark/:bundleName?/:freetId?
 *
 * @param {string} bundleName - The name of the bundle to create
 * @param {string} freetId - The id of the freet to add
 * @return {BundleResponse} - The created bundle
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the bundle name is invalid
 */
router.patch(
    '/:bundleName?/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      bundleValidator.isBundleExists,
      bundleValidator.isFreetNotInBundle
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const bundle = await BundleCollection.addOneFreet(userId, req.params.bundleName, req.params.freetId);
  
      res.status(201).json({
        message: `Your freet was added to bundle ${req.params.bundleName} successfully.`,
        bundle: util.constructBundleResponse(bundle)
      });
    }
  );

   /**
   * Delete a bundle
   *
   * @name DELETE /api/bookmark/:bundleName?
   *
   * @return {string} - A success message
   * @throws {403} - If the user is not logged in or is not the author of
   *                 the bundle
   * @throws {404} - If the freetId is not valid
   */
    router.delete(
        '/:bundleName?',
        [
          userValidator.isUserLoggedIn,
          bundleValidator.isBundleExists
        ],
        async (req: Request, res: Response) => {
            const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
          await BundleCollection.deleteOne(userId, req.params.bundleName);
          res.status(200).json({
            message: 'Your bundle was deleted successfully.'
          });
        }
      );
  
  /**
   * Remove a freet from a bundle
   *
   * @name DELETE /api/bookmark/:bundleName?/:freetId?
   *
   * @param {string} bundleName - The name of the bundle to create
   * @param {string} freetId - The id of the freet to add 
   * @return {BundleResponse} - The created bundle
   * @throws {403} - If the user is not logged in or is not the author of
   *                 the bundle
   * @throws {404} - If the freetId is not valid
   */
  router.delete(
    '/:bundleName?/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      bundleValidator.isBundleExists,
      bundleValidator.isFreetInBundle
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const bundle = await BundleCollection.removeOneFreet(userId, req.params.bundleName, req.params.freetId);
      res.status(200).json({
        message: `Your freet was removed successfully from bundle ${req.params.bundleName}.`,
        bundle: util.constructBundleResponse(bundle)
      });
    }
  );

   

export {router as bundleRouter};

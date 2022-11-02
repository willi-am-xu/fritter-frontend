import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import moment from 'moment';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined && !req.query.media && !req.query.startdate && !req.query.enddate) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    let filteredFreets = allFreets;
    if (req.query.media) {
      filteredFreets = filteredFreets.filter((freet) => {
        if (freet.media) {
          return freet.media === req.query.media;
        }
        else {
          return req.query.media === 'textonly';
        }
      });
    }
    if (req.query.startdate) {
      filteredFreets = filteredFreets.filter((freet) => freet.dateCreated >= moment(req.query.startdate.toString(), 'MMMM Do YYYY, h:mm:ss a').toDate());
    }
    if (req.query.enddate) {
      filteredFreets = filteredFreets.filter((freet) => freet.dateCreated <= moment(req.query.enddate.toString(), 'MMMM Do YYYY, h:mm:ss a').toDate());
    }
    const response = filteredFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    let filteredFreets = authorFreets;
    if (req.query.media) {
      filteredFreets = filteredFreets.filter((freet) => {
        if (freet.media) {
          return freet.media === req.query.media;
        }
        else {
          return req.query.media === 'textonly';
        }
      });
    }
    if (req.query.startdate) {
      console.log(req.query.startdate.toString());
      filteredFreets = filteredFreets.filter((freet) => freet.dateCreated >= new Date(req.query.startdate.toString()));
    }
    if (req.query.enddate) {
      filteredFreets = filteredFreets.filter((freet) => freet.dateCreated <= new Date(req.query.enddate.toString()));
    }
    const response = filteredFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);

    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Like a freet.
 *
 * @name POST /api/freets/:id/like
 *
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.post(
  '/:freetId?/like',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isUnlikedFreet,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOneLike(req.params.freetId, userId);
    res.status(200).json({
      message: 'The freet was liked successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Unlike a freet.
 *
 * @name DELETE /api/freets/:id/like
 *
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.delete(
  '/:freetId?/like',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isLikedFreet,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.removeOneLike(req.params.freetId, userId);
    res.status(200).json({
      message: 'The freet was unliked successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Refreet a freet.
 *
 * @name POST /api/freets/:id/refreet
 *
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.post(
  '/:freetId?/refreet',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isUnreFreetedFreet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOneReFreet(req.params.freetId, userId);
    res.status(200).json({
      message: 'The freet was refreeted successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Unrefreet a freet.
 *
 * @name DELETE /api/freets/:id/refreet
 *
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.delete(
  '/:freetId?/refreet',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isReFreetedFreet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.removeOneReFreet(req.params.freetId, userId);
    res.status(200).json({
      message: 'The freet was unrefreeted successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Personal downvote a freet.
 *
 * @name POST /api/freets/:id/downvote
 *
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.post(
  '/:freetId?/downvote',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isUndownvotedFreet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOneDownvote(req.params.freetId, userId);
    res.status(200).json({
      message: 'The freet was downvoted successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Personal downvote a freet.
 *
 * @name DELETE /api/freets/:id/downvote
 *
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.delete(
  '/:freetId?/downvote',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isDownvotedFreet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.removeOneDownvote(req.params.freetId, userId);
    res.status(200).json({
      message: 'The freet was undownvoted successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

export {router as freetRouter};

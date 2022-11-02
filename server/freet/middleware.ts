import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

const isUnlikedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = req.session.userId;
  if (freet.likes.map((id) => id.toString()).includes(userId)) {
    res.status(403).json({
      error: 'Cannot double like freets.'
    });
    return;
  }

  next();
};

const isLikedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = req.session.userId;
  if (!freet.likes.map((id) => id.toString()).includes(userId)) {
    res.status(403).json({
      error: 'Cannot unlike freets without liking first.'
    });
    return;
  }

  next();
};

const isUnreFreetedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = req.session.userId;
  if (freet.reFreets.map((id) => id.toString()).includes(userId)) {
    res.status(403).json({
      error: 'Cannot double refreet freets.'
    });
    return;
  }

  next();
};

const isReFreetedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = req.session.userId;
  if (!freet.reFreets.map((id) => id.toString()).includes(userId)) {
    res.status(403).json({
      error: 'Cannot unrefreet freets without refreeting first.'
    });
    return;
  }

  next();
};

const isUndownvotedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = req.session.userId;
  if (freet.personalDownvotes.map((id) => id.toString()).includes(userId)) {
    res.status(403).json({
      error: 'Cannot double downvote freets.'
    });
    return;
  }

  next();
};

const isDownvotedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = req.session.userId;
  if (!freet.personalDownvotes.map((id) => id.toString()).includes(userId)) {
    res.status(403).json({
      error: 'Cannot undownvote freets without downvoting first.'
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  isLikedFreet,
  isUnlikedFreet,
  isDownvotedFreet,
  isUndownvotedFreet,
  isReFreetedFreet,
  isUnreFreetedFreet
};

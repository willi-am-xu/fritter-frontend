import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BundleCollection from './collection';

const isBundleExists = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.bundleName) {
        res.status(400).json({
            error: {
              freetNotFound: `Bundle name must be nonempty.`
            }
          });
          return;
    }
    const bundle = await BundleCollection.findOneByName(req.session?.userId, req.params.bundleName);

    if (!bundle) {
      res.status(404).json({
        error: {
          freetNotFound: `Bundle with name ${req.params.bundleName} does not exist.`
        }
      });
      return;
    }
  
    next();
  };

  const isValidBundleName = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.bundleName) {
        res.status(400).json({
            error: {
              freetNotFound: `Bundle name must be nonempty.`
            }
          });
          return;
    }
    const bundle = await BundleCollection.findOneByName(req.session?.userId, req.params.bundleName);

    if (bundle) {
      res.status(404).json({
        error: {
          freetNotFound: `Bundle with name ${req.params.bundleName} already exists for user.`
        }
      });
      return;
    }
  
    next();
  };

  const isFreetInBundle = async (req: Request, res: Response, next: NextFunction) => {
    const bundle = await BundleCollection.findOneByName(req.session?.userId, req.params.bundleName);

    if (!bundle.freets.map((freet) => freet._id.toString()).includes(req.params.freetId)) {
      res.status(403).json({
        error: {
          freetNotFound: `Bundle with name ${req.params.bundleName} does not contain freet.`
        }
      });
      return;
    }
  
    next();
  };

  const isFreetNotInBundle = async (req: Request, res: Response, next: NextFunction) => {
    const bundle = await BundleCollection.findOneByName(req.session?.userId, req.params.bundleName);

    if (bundle.freets.map((freet) => freet._id.toString()).includes(req.params.freetId)) {
      res.status(403).json({
        error: {
          freetFound: `Bundle with name ${req.params.bundleName} already contains freet.`
        }
      });
      return;
    }
  
    next();
  };



  export {
    isBundleExists,
    isValidBundleName,
    isFreetInBundle,
    isFreetNotInBundle,
  };
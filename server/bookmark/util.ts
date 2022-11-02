import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';
import type {Bundle, PopulatedBundle} from '../bookmark/model';

// Update this if you add a property to the Freet type!
type BundleResponse = {
  _id: string;
  author: string;
  bundleName: string;
  freets: Array<string>;
  dateCreated: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Bundle object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Bundle>} Bundle - A bundle
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructBundleResponse = (bundle: HydratedDocument<Bundle>): BundleResponse => {
  const bundleCopy: PopulatedBundle = {
    ...bundle.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = bundleCopy.authorId;
  delete bundleCopy.authorId;
  const freetIds = bundleCopy.freets.map((freet) => freet._id.toString())
  return {
    ...bundleCopy,
    _id: bundleCopy._id.toString(),
    author: username,
    freets: freetIds,
    dateCreated: formatDate(bundle.dateCreated),
    dateModified: formatDate(bundle.dateModified)
  };
};

export {
  constructBundleResponse
};

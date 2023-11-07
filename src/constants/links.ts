import * as Application from "expo-application";

const itunesItemId = 6469723047;

export default {
  privacyPolicy:
    "https://www.privacypolicies.com/live/e8582dba-e429-4c6a-8347-8b93e3a4867d",
  appStoreReview: `https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`,
  playStoreReview: `market://details?id=${Application.applicationId}&showAllReviews=true`,
};
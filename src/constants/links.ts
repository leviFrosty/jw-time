import * as Application from 'expo-application'

const itunesItemId = 6469723047
const githubRepo = 'https://github.com/leviFrosty/witness-work'

export default {
  privacyPolicy:
    'https://www.privacypolicies.com/live/e8582dba-e429-4c6a-8347-8b93e3a4867d',
  appStore: `https://apps.apple.com/us/app/jw-time/id${itunesItemId}`,
  playStore:
    'https://play.google.com/store/apps/details?id=com.leviwilkerson.witnesswork',
  appStoreReview: `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`,
  playStoreReview: `market://details?id=${Application.applicationId}&showAllReviews=true`,
  githubRepo,
  appleMapsBase: 'http://maps.apple.com/?q=',
  googleMapsBase: 'https://www.google.com/maps/search/?api=1&query=',
  wazeMapsBase: 'https://waze.com/ul?q=',
  hourglassBase: 'https://app.hourglass-app.com/report/submit?',
  bugReport: `${githubRepo}/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D`,
  featureRequest: `${githubRepo}/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5BFEATURE%5D`,
  donate: 'https://ko-fi.com/leviwilkerson',
  termsOfUse:
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  nwpublisherSubmitReport: 'https://nwpublisher.com/report/',
  crowdin: 'https://crowdin.com/project/jw-time',
}

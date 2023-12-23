import { Alert, Platform, View } from 'react-native'
import Section from '../../../components/inputs/Section'
import i18n from '../../../lib/locales'
import InputRowButton from '../../../components/inputs/InputRowButton'
import {
  faChevronRight,
  faGlobe,
  faHeart,
} from '@fortawesome/free-solid-svg-icons'
import * as Linking from 'expo-linking'
import links from '../../../constants/links'
import IconButton from '../../../components/IconButton'
import SettingsSectionTitle from '../shared/SettingsSectionTitle'

const SupportSection = () => {
  return (
    <View style={{ gap: 3 }}>
      <SettingsSectionTitle text={i18n.t('support')} />
      <Section>
        <InputRowButton
          leftIcon={faHeart}
          label={
            Platform.OS === 'android'
              ? i18n.t('rateJWTimeOnPlayStore')
              : i18n.t('rateJWTimeOnAppStore')
          }
          onPress={() => {
            try {
              Platform.OS === 'android'
                ? Linking.openURL(links.playStoreReview)
                : Linking.openURL(links.appStoreReview)
            } catch (error) {
              Alert.alert(
                Platform.OS === 'android'
                  ? i18n.t('androidAppStoreReviewErrorTitle')
                  : i18n.t('appleAppStoreReviewErrorTitle'),
                Platform.OS === 'android'
                  ? i18n.t('androidAppStoreReviewErrorMessage')
                  : i18n.t('appleAppStoreReviewErrorMessage')
              )
            }
          }}
        >
          <IconButton icon={faChevronRight} />
        </InputRowButton>

        <InputRowButton
          leftIcon={faGlobe}
          label={i18n.t('helpTranslate')}
          onPress={async () => {
            const emailMe = async () => {
              const email = 'levi.wilkerson@proton.me'
              const subjectText = '[JW Time] Help Translate'
              const bodyText = `${i18n.t(
                'iWouldLikeToHelpTranslate'
              )}: --------------`
              const subject = encodeURIComponent(subjectText)
              const body = encodeURIComponent(bodyText)
              try {
                await Linking.openURL(
                  `mailto:${email}?subject=${subject}&body=${body}`
                )
              } catch (error) {
                Alert.alert(
                  i18n.t('error'),
                  i18n.t('failedToOpenMailApplication')
                )
              }
            }

            Alert.alert(
              i18n.t('helpTranslateTitle'),
              i18n.t('helpTranslate_message'),
              [
                {
                  text: i18n.t('cancel'),
                  style: 'cancel',
                },
                {
                  text: i18n.t('yes'),
                  onPress: emailMe,
                },
              ]
            )
          }}
          lastInSection
        >
          <IconButton icon={faChevronRight} />
        </InputRowButton>
      </Section>
    </View>
  )
}
export default SupportSection
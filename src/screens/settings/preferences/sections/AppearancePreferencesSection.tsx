import { View } from 'react-native'
import Section from '../../../../components/inputs/Section'
import InputRowContainer from '../../../../components/inputs/InputRowContainer'
import i18n from '../../../../lib/locales'
import Select from '../../../../components/Select'
import { usePreferences } from '../../../../stores/preferences'
import Text from '../../../../components/MyText'
import { useContext } from 'react'
import { ThemeContext } from '../../../../contexts/theme'

const AppearancePreferencesSection = () => {
  const { set, fontSizeOffset } = usePreferences()
  const theme = useContext(ThemeContext)
  const fontSizeOffsetOptions = [
    { label: '-1', value: -1 },
    { label: '0', value: 0 },
    { label: '+1', value: 1 },
    { label: '+2', value: 2 },
    { label: '+3', value: 3 },
    { label: '+4', value: 4 },
  ]

  return (
    <View style={{ gap: 3 }}>
      <Section>
        <InputRowContainer
          label={i18n.t('fontSizeOffset')}
          style={{ justifyContent: 'space-between' }}
          lastInSection
        >
          <View style={{ flex: 1 }}>
            <Select
              data={fontSizeOffsetOptions}
              value={fontSizeOffset}
              onChange={({ value }) => set({ fontSizeOffset: value })}
            />
          </View>
        </InputRowContainer>
        <Text
          style={{
            fontSize: theme.fontSize('sm'),
            color: theme.colors.textAlt,
          }}
        >
          {i18n.t('thisGloballyOffsetsTextSize')}
        </Text>
      </Section>
    </View>
  )
}

export default AppearancePreferencesSection
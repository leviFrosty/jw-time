import { View, ScrollView } from 'react-native'
import Text from '../components/MyText'
import useServiceReport from '../stores/serviceReport'
import useTheme from '../contexts/theme'
import { ServiceReport } from '../types/serviceReport'
import moment from 'moment'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Card from '../components/Card'
import ActionButton from '../components/ActionButton'
import { RootStackParamList } from '../stacks/RootStack'
import i18n from '../lib/locales'
import { useMemo, useState } from 'react'

import ExportTimeSheet, {
  ExportTimeSheetState,
} from '../components/ExportTimeSheet'
import MonthSummary from '../components/MonthSummary'
import TimeReportRow from '../components/TimeReportRow'
import IconButton from '../components/IconButton'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Wrapper from '../components/layout/Wrapper'
import Divider from '../components/Divider'
import Button from '../components/Button'
import { FlashList } from '@shopify/flash-list'

type Props = NativeStackScreenProps<RootStackParamList, 'Time Reports'>

const TimeReportsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme()
  const { serviceReports } = useServiceReport()
  const insets = useSafeAreaInsets()
  const [year, setYear] = useState(route.params?.year || moment().year())
  const [month, setMonth] = useState(route.params?.month || moment().month())
  const [sheet, setSheet] = useState<ExportTimeSheetState>({
    open: false,
    month,
    year,
  })

  const reportsByYearAndMonth = useMemo(() => {
    const reports: {
      [year: string]: { [month: string]: ServiceReport[] }
    } = {}

    for (const report of serviceReports) {
      const yearKey = moment(report.date).year()
      const monthKey = moment(report.date).month()

      if (!reports[yearKey]) {
        reports[yearKey] = {}
      }

      if (!reports[yearKey][monthKey]) {
        reports[yearKey][monthKey] = []
      }

      reports[yearKey][monthKey].push(report)
    }

    return reports
  }, [serviceReports])

  const years = useMemo(
    () =>
      Object.keys(reportsByYearAndMonth).sort(
        (a, b) => parseInt(b) - parseInt(a)
      ),
    [reportsByYearAndMonth]
  )

  const thisMonthsReports = reportsByYearAndMonth[year]
    ? reportsByYearAndMonth[year][month] &&
      reportsByYearAndMonth[year][month].length > 0
      ? reportsByYearAndMonth[year][month]
      : null
    : null

  if (!years.length) {
    return (
      <Wrapper>
        <Card style={{ marginHorizontal: 15 }}>
          <Text
            style={{
              fontSize: theme.fontSize('lg'),
              fontFamily: theme.fonts.semiBold,
            }}
          >
            {i18n.t('noTimeEntriesYet')}
          </Text>
          <Text
            style={{
              fontSize: theme.fontSize('sm'),
              color: theme.colors.textAlt,
            }}
          >
            {i18n.t('addATimeEntryToViewReport')}
          </Text>
          <ActionButton onPress={() => navigation.navigate('Add Time')}>
            {i18n.t('addTime')}
          </ActionButton>
        </Card>
      </Wrapper>
    )
  }

  const handleArrowNavigate = (direction: 'forward' | 'back') => {
    if (direction === 'forward') {
      if (month === 11) {
        setMonth(0)
        setYear(year + 1)
      } else {
        setMonth(month + 1)
      }
    } else {
      if (month === 0) {
        setMonth(11)
        setYear(year - 1)
      } else {
        setMonth(month - 1)
      }
    }
  }

  const selectedMonth = moment().month(month).year(year)

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flexGrow: 1,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 20,
          gap: 30,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button onPress={() => handleArrowNavigate('back')}>
            <View
              style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
            >
              <IconButton icon={faArrowLeft} size={15} />
              <Text style={{ color: theme.colors.textAlt }}>
                {moment(selectedMonth).subtract(1, 'month').format('MMM')}
              </Text>
            </View>
          </Button>
          <Text style={{ fontSize: theme.fontSize('xl') }}>
            {moment(selectedMonth).format('MMMM YYYY')}
          </Text>
          {moment().isAfter(selectedMonth, 'month') ? (
            <Button onPress={() => handleArrowNavigate('forward')}>
              <View
                style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
              >
                <Text style={{ color: theme.colors.textAlt }}>
                  {moment(selectedMonth).add(1, 'month').format('MMM')}
                </Text>
                <IconButton icon={faArrowRight} size={15} />
              </View>
            </Button>
          ) : (
            <View style={{ width: 50 }} />
          )}
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 30,
          paddingBottom: insets.bottom + 30,
        }}
        contentInset={{ top: 0, right: 0, bottom: insets.bottom + 30, left: 0 }}
      >
        <View style={{ paddingHorizontal: 15 }}>
          <MonthSummary
            month={month}
            year={year}
            monthsReports={thisMonthsReports}
            setSheet={setSheet}
          />
        </View>
        <Divider marginVertical={30} />
        <View style={{ paddingHorizontal: 15, gap: 7 }}>
          <Text
            style={{
              color: theme.colors.textAlt,
              textTransform: 'uppercase',
              fontSize: theme.fontSize('sm'),
              fontFamily: theme.fonts.semiBold,
            }}
          >
            {i18n.t('entries')}
          </Text>
          <View style={{ gap: 10, flex: 1, minHeight: 10 }}>
            <FlashList
              data={
                thisMonthsReports
                  ? thisMonthsReports.sort((a, b) =>
                      moment(a.date).unix() < moment(b.date).unix() ? 1 : -1
                    )
                  : undefined
              }
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => <TimeReportRow report={item} />}
              estimatedItemSize={66}
              ListEmptyComponent={
                <Text>{i18n.t('noReportsThisMonthYet')}</Text>
              }
            />
          </View>
        </View>
      </ScrollView>
      <ExportTimeSheet setSheet={setSheet} sheet={sheet} />
    </View>
  )
}
export default TimeReportsScreen
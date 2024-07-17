import { useMemo } from 'react'
import useTheme from '../contexts/theme'
import Text from './MyText'
import moment from 'moment'
import {
  plannedMinutesToCurrentDayForMonth,
  totalMinutesForSpecificMonthUpToDayOfMonth,
} from '../lib/serviceReport'
import _ from 'lodash'
import useServiceReport from '../stores/serviceReport'
import i18n from '../lib/locales'
import { ThemeSizes } from '../types/theme'

type AheadOrBehindOfMonthScheduleProps = {
  month: number
  year: number
  fontSize?: ThemeSizes
}

export default function AheadOrBehindOfMonthSchedule(
  props: AheadOrBehindOfMonthScheduleProps
) {
  const { month, year } = props
  const theme = useTheme()
  const { dayPlans, recurringPlans, serviceReports } = useServiceReport()

  const plannedMinutesToCurrentDay = useMemo(() => {
    return plannedMinutesToCurrentDayForMonth(
      month,
      year,
      dayPlans,
      recurringPlans
    )
  }, [dayPlans, month, recurringPlans, year])

  const actualMinutesToCurrentDay = useMemo(() => {
    const selectedMonth = moment().month(month).year(year)

    const dayOfMonth = selectedMonth.isBefore(moment(), 'month')
      ? selectedMonth.daysInMonth()
      : moment().date()

    return totalMinutesForSpecificMonthUpToDayOfMonth(
      serviceReports,
      dayOfMonth,
      month,
      year
    )
  }, [month, serviceReports, year])

  const hoursDiffToSchedule = useMemo(() => {
    return _.round(
      (actualMinutesToCurrentDay - plannedMinutesToCurrentDay) / 60,
      1
    )
  }, [actualMinutesToCurrentDay, plannedMinutesToCurrentDay])

  /** Previous month has no plans or the */
  if (plannedMinutesToCurrentDay === 0) {
    return null
  }

  if (hoursDiffToSchedule === 0) {
    return (
      <Text
        style={{
          color:
            hoursDiffToSchedule >= 0 ? theme.colors.accent : theme.colors.text,
          fontFamily: theme.fonts.semiBold,
          fontSize: theme.fontSize(props.fontSize ?? 'md'),
        }}
      >
        {i18n.t('onSchedule')}
      </Text>
    )
  }

  return (
    <Text
      style={{
        color:
          hoursDiffToSchedule >= 0 ? theme.colors.accent : theme.colors.error,
        fontFamily: theme.fonts.semiBold,
        fontSize: theme.fontSize(props.fontSize ?? 'md'),
        textTransform: 'lowercase',
      }}
    >
      {`${Math.abs(hoursDiffToSchedule)} ${Math.abs(hoursDiffToSchedule) === 1 ? i18n.t('hour') : i18n.t('hours')} ${hoursDiffToSchedule > 0 ? i18n.t('aheadOfSchedule') : i18n.t('behindSchedule')}`}
    </Text>
  )
}
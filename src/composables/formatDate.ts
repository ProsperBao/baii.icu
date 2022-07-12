import dayjs from 'dayjs'

export const formatDate = (date: string) => dayjs(date).subtract(8, 'h').format('YYYY-MM-DD HH')

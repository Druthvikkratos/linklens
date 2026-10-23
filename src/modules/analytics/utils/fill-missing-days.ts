import { DailyCountRecord } from '../analytics.service';

export function fillMissingDays(
  array: DailyCountRecord[],
  fromDate: Date,
  toDate: Date,
) {
  const clicksByDate = new Map<string, number>();
  array.forEach((item) => {
    clicksByDate.set(item.date, item.count);
  });
  const from: Date = new Date(fromDate);
  from.setUTCHours(0, 0, 0, 0);
  const to: Date = new Date(toDate);
  to.setUTCHours(0, 0, 0, 0);
  const results: DailyCountRecord[] = [];
  const currentDate: Date = new Date(from);

  while (currentDate.getTime() <= to.getTime()) {
    const curr = new Date(currentDate).toISOString().slice(0, 10)
    const count = clicksByDate.get(curr) ?? 0;
    results.push({
      date: curr,
      count: count,
    });
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return results
}

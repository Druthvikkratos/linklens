import type { DailyCountRecord } from '../analytics.types';
import { fillMissingDays } from './fill-missing-days';

describe('fill-missing-days', () => {
  it('should return three records', () => {
    const emptyArray: DailyCountRecord[] = [];
    const fromDateStr = '2026-10-01';
    const toDateStr = '2026-10-03';
    const output = [
      {
        count: 0,
        date: '2026-10-01',
      },
      {
        count: 0,
        date: '2026-10-02',
      },
      {
        count: 0,
        date: '2026-10-03',
      },
    ];
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);
    const actual = fillMissingDays(emptyArray, fromDate, toDate);
    expect(actual).toEqual(output);
  });
  it('should fill missing dates with zero counts', () => {
    const input = [
      { date: '2026-10-01', count: 5 },
      { date: '2026-10-03', count: 8 },
    ];
    const actual = fillMissingDays(
      input,
      new Date('2026-10-01T00:00:00Z'),
      new Date('2026-10-03T00:00:00Z'),
    );
    expect(actual).toEqual([
      { date: '2026-10-01', count: 5 },
      { date: '2026-10-02', count: 0 },
      { date: '2026-10-03', count: 8 },
    ]);
  });
  it('should return one record when fromDate and toDate are the same day', () => {
    const actual = fillMissingDays(
      [],
      new Date('2026-10-01T00:00:00Z'),
      new Date('2026-10-01T23:59:59Z'),
    );
    expect(actual).toEqual([{ date: '2026-10-01', count: 0 }]);
  });
  it('should ignore records outside the requested date range', () => {
    const input = [
      { date: '2026-09-30', count: 10 },
      { date: '2026-10-02', count: 4 },
      { date: '2026-10-04', count: 20 },
    ];
    const actual = fillMissingDays(
      input,
      new Date('2026-10-01T00:00:00Z'),
      new Date('2026-10-03T00:00:00Z'),
    );
    expect(actual).toEqual([
      { date: '2026-10-01', count: 0 },
      { date: '2026-10-02', count: 4 },
      { date: '2026-10-03', count: 0 },
    ]);
  });
  it('should include every UTC date in the range', () => {
    const actual = fillMissingDays(
      [],
      new Date('2026-10-01T23:30:00Z'),
      new Date('2026-10-03T00:10:00Z'),
    );

    expect(actual).toEqual([
      { date: '2026-10-01', count: 0 },
      { date: '2026-10-02', count: 0 },
      { date: '2026-10-03', count: 0 },
    ]);
  });
  it('should return records in oldest-first order', () => {
    const rows: DailyCountRecord[] = [
      { date: '2026-10-03', count: 8 },
      { date: '2026-10-01', count: 5 },
    ];

    const actual = fillMissingDays(
      rows,
      new Date('2026-10-01T00:00:00Z'),
      new Date('2026-10-03T00:00:00Z'),
    );

    expect(actual).toEqual([
      { date: '2026-10-01', count: 5 },
      { date: '2026-10-02', count: 0 },
      { date: '2026-10-03', count: 8 },
    ]);
  });
  it('should not mutate the input Date objects', () => {
    const from = new Date('2026-10-01T12:30:00Z');
    const to = new Date('2026-10-03T18:45:00Z');

    const originalFrom = from.getTime();
    const originalTo = to.getTime();

    fillMissingDays([], from, to);

    expect(from.getTime()).toBe(originalFrom);
    expect(to.getTime()).toBe(originalTo);
  });
  it('should return an empty array when toDate is before fromDate', () => {
    const actual = fillMissingDays(
      [],
      new Date('2026-10-03T00:00:00Z'),
      new Date('2026-10-01T00:00:00Z'),
    );

    expect(actual).toEqual([]);
  });
});

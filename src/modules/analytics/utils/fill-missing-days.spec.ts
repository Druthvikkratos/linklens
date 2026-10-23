import { Test, TestingModule } from '@nestjs/testing';
import { fillMissingDays } from './fill-missing-days';

describe('fill-missing-days', () => {
  it('should return three records', () => {
    const emptyArray = [];
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
});

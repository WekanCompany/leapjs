export interface IParserOptions {
  currentDate?: string | number | Date;
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  iterator?: boolean;
  utc?: boolean;
  tz?: string;
}

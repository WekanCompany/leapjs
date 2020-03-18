function buildResultWithPagination(
  keyName: string,
  results: any,
  page: number,
  perPage: number,
): any {
  const pageNo = Math.round(page / perPage + 1);
  const result: any = { data: {} };

  [result.data[keyName]] = results;

  if (page !== undefined && !Number.isNaN(page)) {
    result.meta = {
      pagination: {
        page: pageNo > results[1] ? results[1] : pageNo,
        total: results[1],
      },
    };
  }
  return result;
}

export default buildResultWithPagination;

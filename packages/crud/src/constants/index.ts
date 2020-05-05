const crudMethodParams = new Map<string, [string, [string, string][]]>();
crudMethodParams.set('createOne', [
  'post',
  [
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethodParams.set('createMany', [
  'post',
  [
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethodParams.set('updateOne', [
  'patch',
  [
    ['param', 'id'],
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethodParams.set('replaceOne', [
  'put',
  [
    ['param', 'id'],
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethodParams.set('getOne', [
  'get',
  [
    ['param', 'id'],
    ['query', 'fields'],
    ['query', 'expand'],
    ['response', ''],
  ],
]);
crudMethodParams.set('getMany', [
  'get',
  [
    ['query', 'fields'],
    ['query', 'expand'],
    ['query', 'sort'],
    ['query', 'page'],
    ['query', 'perPage'],
    ['response', ''],
  ],
]);
crudMethodParams.set('deleteOne', [
  'delete',
  [
    ['param', 'id'],
    ['response', ''],
  ],
]);

export default crudMethodParams;

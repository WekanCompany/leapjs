const crudMethods = new Map<string, [string, [string, string][]]>();
crudMethods.set('createOne', [
  'post',
  [
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethods.set('createMany', [
  'post',
  [
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethods.set('updateOne', [
  'patch',
  [
    ['param', 'id'],
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethods.set('replaceOne', [
  'put',
  [
    ['param', 'id'],
    ['body', ''],
    ['response', ''],
  ],
]);
crudMethods.set('getOne', [
  'get',
  [
    ['param', 'id'],
    ['query', 'fields'],
    ['query', 'expand'],
    ['response', ''],
  ],
]);
crudMethods.set('getMany', [
  'get',
  [
    ['query', 'fields'],
    ['query', 'expand'],
    ['query', 'sort'],
    ['query', 'page'],
    ['query', 'per_page'],
    ['response', ''],
  ],
]);
crudMethods.set('deleteOne', [
  'delete',
  [
    ['param', 'id'],
    ['response', ''],
  ],
]);

export default crudMethods;

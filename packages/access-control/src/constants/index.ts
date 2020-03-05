const acActions = {
  POST: 'create',
  PUT: 'replace',
  PATCH: 'update',
  GET: 'list',
  DELETE: 'delete',
};

enum RoleStatus {
  DRAFT = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export { acActions, RoleStatus };

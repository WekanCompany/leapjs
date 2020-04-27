const CLASS_NOT_FOUND = 'Controller not found';
const PARAM_TYPE_METADATA_NOT_FOUND = 'Param type metadata not found';
const ORIGIN_BLOCKED = 'Origin is blocked by the CORS policy';

const DUPLICATED_ROUTABLE_DECORATOR =
  'Cannot add multiple DI decorators (@crud, @injectable, @middleware or @controller) to the same class';

const INVALID_BEFORE_MIDDLEWARE_CLASS =
  'middleware class must contain a before method';
const INVALID_AFTER_MIDDLEWARE_CLASS =
  'middleware class must contain a after method';

export {
  CLASS_NOT_FOUND,
  PARAM_TYPE_METADATA_NOT_FOUND,
  ORIGIN_BLOCKED,
  DUPLICATED_ROUTABLE_DECORATOR,
  INVALID_BEFORE_MIDDLEWARE_CLASS,
  INVALID_AFTER_MIDDLEWARE_CLASS,
};

const INVALID_DECORATOR_OPERATION =
  '@inject must be applied to a constructor parameter or class property';

const DUPLICATED_METADATA = 'Metadata key already exists';
const DUPLICATED_INJECTABLE_DECORATOR =
  'Cannot apply multiple decorators (@injectable, @middleware or @controller) to the same object';

const INVALID_INJECTION = 'Error injecting `undefined`';

export {
  INVALID_DECORATOR_OPERATION,
  DUPLICATED_METADATA,
  DUPLICATED_INJECTABLE_DECORATOR,
  INVALID_INJECTION,
};

import Metadata from '../../classes/metadata';
import { ServiceIdentifierOrFunc } from '../../definitions/injector';
import {
  addParameterMetadata,
  addPropertyMetadata,
} from '../../utils/metadata';
import { INVALID_INJECTION } from '../../resources/strings';

function inject(serviceIdentifier: ServiceIdentifierOrFunc) {
  return (target: any, targetKey: string, index?: number): void => {
    if (serviceIdentifier === undefined) {
      throw new Error(INVALID_INJECTION);
    }
    let metadata = new Metadata('inject', serviceIdentifier);
    if (
      typeof serviceIdentifier === 'function' &&
      serviceIdentifier.name !== ''
    ) {
      metadata = new Metadata('inject', () => serviceIdentifier);
    }
    if (typeof index === 'number') {
      addParameterMetadata(target, targetKey, index, metadata);
    } else {
      addPropertyMetadata(target, targetKey, metadata);
    }
  };
}

export default inject;

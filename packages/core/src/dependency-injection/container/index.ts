import { parseScript } from 'esprima';
import {
  IConstructor,
  LEAP_TAGGED_PROPERTIES,
  LEAP_TAGGED_PARAMETERS,
  LEAP_PARAM_TYPES,
  DESIGN_PARAM_TYPES,
  IIdentifier,
  ILeapContainer,
} from '@leapjs/common';

class Container implements ILeapContainer {
  protected parent: Container | undefined = undefined;
  // protected options: IContainerOptions;

  protected registry = new Map<Function, any>();
  private classMetadata: {
    target: IConstructor<any>;
    parameters: { name: string; metadata: any[] }[];
  }[] = [];

  private parameterResolver: any = [];
  private propertyResolver: any = [];

  private getArguments(func: IConstructor<any>): IIdentifier[] {
    const functionAsString = func.toString();
    const tree: any = parseScript(functionAsString);
    return tree.body[0].body.body[0].value.params;
  }

  // TODO move to utils
  private getMetadata(klass: IConstructor<any>, metadataType: string): any {
    return Reflect.getMetadata(metadataType, klass) || undefined;
  }

  private resolveConstructorDependencies(
    target: IConstructor<any>,
    Klass: IConstructor<any>,
    match: any,
  ): Function {
    const parameters: any = [];
    const { length } = match.parameters;

    for (let i = 0; i < length; i += 1) {
      const paramValue = Array.isArray(match.parameters[i].metadata)
        ? match.parameters[i].metadata[0].value()
        : undefined;
      if (this.registry.has(paramValue)) {
        parameters.push(this.registry.get(paramValue));
      } else {
        parameters.push(paramValue);
        this.parameterResolver.push(parameters);
        this.parameterResolver.push(Klass);
        this.parameterResolver.push(target);
      }
    }

    return new Klass(...parameters);
  }

  public resolve<T>(Target: IConstructor<any>): T {
    const ctorParameters = this.getMetadata(Target, LEAP_TAGGED_PARAMETERS);
    const classAttributes = this.getMetadata(Target, LEAP_TAGGED_PROPERTIES);
    const parameters: any = { target: Target, parameters: [] };
    const parameterTypes = this.getMetadata(Target, LEAP_PARAM_TYPES);
    const args = this.getArguments(Target);

    const injections: any = [];

    let resolved!: T;

    if (parameterTypes === undefined) {
      return new Target();
    }

    for (let i = 0; i < args.length; i += 1) {
      parameters.parameters[i] = {
        name: args[i].name,
        metadata: parameterTypes[i],
      };
    }

    if (
      this.classMetadata.find(
        (metadata: { target: IConstructor<any> }) => metadata.target === Target,
      ) === undefined
    ) {
      this.classMetadata.push(parameters);
    }

    if (ctorParameters && Object.keys(ctorParameters).length > 0) {
      let index = 0;

      Object.keys(ctorParameters).forEach((key) => {
        if (typeof ctorParameters[key][0].value === 'function') {
          const Dependency = ctorParameters[key][0].value();
          let dependencyMetadata =
            Reflect.getMetadata(DESIGN_PARAM_TYPES, Dependency) ||
            Reflect.getMetadata(LEAP_TAGGED_PROPERTIES, Dependency);

          if (dependencyMetadata && typeof dependencyMetadata === 'object') {
            [dependencyMetadata] = Object.values(dependencyMetadata);
          }

          if (dependencyMetadata && dependencyMetadata.length > 0) {
            for (let j = 0; j < dependencyMetadata.length; j += 1) {
              const match = this.classMetadata.find(
                (metadata: { target: IConstructor<any> }) =>
                  metadata.target === Dependency,
              );
              if (match === undefined) {
                injections[index] = this.resolve<typeof Dependency>(Dependency);
              } else {
                injections[index] = this.resolveConstructorDependencies(
                  Target,
                  Dependency,
                  match,
                );
              }
              this.registry.set(Dependency, injections[index]);
            }
          } else {
            injections[index] = new Dependency();
          }
          this.registry.set(Dependency, injections[index]);
          index += 1;
        } else {
          injections[index] = ctorParameters[key][0].value;
        }
      });

      const { length } = this.parameterResolver;

      for (let x = 0; x < length; x += 3) {
        const unresolvedDependencies: any = this.registry.get(
          this.parameterResolver[x + 2],
        );
        if (unresolvedDependencies) {
          let y = 0;
          const i = Object.keys(unresolvedDependencies)[0];
          if (i) {
            Object.keys(unresolvedDependencies[i]).forEach((key) => {
              if (this.parameterResolver[x][y]) {
                unresolvedDependencies[Object.keys(unresolvedDependencies)[0]][
                  key
                ] = this.registry.get(this.parameterResolver[x][y]);
                y += 1;
              }
            });
          }
        }
      }

      const result = new Target(...injections);
      this.registry.set(Target, result);

      resolved = result;
    }

    if (classAttributes) {
      const klass = resolved || new Target();
      Object.keys(classAttributes).forEach((key) => {
        if (typeof classAttributes[key][0].value === 'function') {
          const Dependency = classAttributes[key][0].value();
          this.registry.set(classAttributes[key][0].value(), new Dependency());
          let dependencyMetadata =
            Reflect.getMetadata(LEAP_TAGGED_PARAMETERS, Dependency) ||
            Reflect.getMetadata(LEAP_TAGGED_PROPERTIES, Dependency);
          if (dependencyMetadata && typeof dependencyMetadata === 'object') {
            [dependencyMetadata] = Object.values(dependencyMetadata);
          }
          if (dependencyMetadata && dependencyMetadata.length > 0) {
            for (let j = 0; j < dependencyMetadata.length; j += 1) {
              const match = this.classMetadata.find(
                (metadata) => metadata.target === Dependency,
              );
              if (match === undefined) {
                klass[key] = this.resolve(Dependency);
              } else {
                klass[key] = this.resolveConstructorDependencies(
                  Target,
                  Dependency,
                  match,
                );
              }
              this.registry.set(Dependency, klass[key]);
            }
          } else {
            klass[key] = new Dependency();
            this.registry.set(Dependency, klass[key]);
          }
          this.propertyResolver.push(key);
          this.propertyResolver.push(Dependency);
          this.propertyResolver.push(Target);
        } else {
          klass[key] = classAttributes[key][0].value;
        }
      });

      const { length } = this.propertyResolver;

      for (let x = 0; x < length; x += 3) {
        const unresolvedDependencies: any = this.registry.get(
          this.propertyResolver[x + 2],
        );
        if (unresolvedDependencies) {
          unresolvedDependencies[this.propertyResolver[x]] = this.registry.get(
            this.propertyResolver[x + 1],
          );
        }
      }

      resolved = klass;
    }

    if (resolved === undefined) {
      resolved = new Target();
    }

    return resolved;
  }
}

export default Container;

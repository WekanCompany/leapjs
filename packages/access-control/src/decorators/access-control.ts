import { Response, NextFunction } from 'express';
import { findMatching, ForbiddenException } from '@leapjs/common';
import { acActions } from '../constants';
import formatPermissionError from '../utils';

async function callConstraint(
  req: any,
  res: Response,
  next: NextFunction,
  constraint: (req: any, res: Response) => Promise<[boolean, string?]>,
  method: string,
  name: string,
): Promise<void> {
  const result = await constraint(req, res);
  if (!result[0]) {
    return next(
      new ForbiddenException(
        result[1] ? result[1] : formatPermissionError(method, name),
      ),
    );
  }
}

function handleCustomAction(
  action: string,
  req: any,
  res: Response,
  next: NextFunction,
  requestedMethod: string,
  requestedResourceName: string,
  constraint?: (req: any, res: Response) => Promise<[boolean, string?]>,
): void {
  if (action === 'own') {
    if (constraint !== undefined) {
      callConstraint(
        req,
        res,
        next,
        constraint,
        requestedMethod,
        requestedResourceName,
      );
    }
  }
}

function accessControl(
  pathComponent?: string,
  constraint?: (req: any, res: Response) => Promise<[boolean, string?]>,
): (req: any, res: Response, next: NextFunction) => any {
  return (req: any, res: Response, next: NextFunction): void => {
    if (req.decodedToken && req.decodedToken.access) {
      const { access }: any = req.decodedToken;
      const requestedMethod = acActions[req.method];
      let requestedResourceName =
        pathComponent === undefined ? '' : pathComponent;
      if (requestedResourceName === '') {
        const route = req.originalUrl.split('/');
        [requestedResourceName] = route[2].split('?');
      }

      if (Array.isArray(access)) {
        const checkList: any = findMatching(
          'resource',
          ['*', requestedResourceName],
          access,
        );
        if (checkList.length > 0) {
          const actions = findMatching(
            'action',
            ['*', requestedMethod],
            checkList,
          );
          if (actions.length > 0) {
            const action: any = checkList[0].action.split(':');
            handleCustomAction(
              action[1],
              req,
              res,
              next,
              requestedMethod,
              requestedResourceName,
              constraint,
            );
            req.decodedToken.attributes = checkList[0].attributes;
            return next();
          }
        }
      } else if (
        access.resource === '*' ||
        access.resource === requestedResourceName
      ) {
        const action = access.action.split(':');
        if (action[0] === '*' || action[0].includes(requestedMethod)) {
          handleCustomAction(
            action[1],
            req,
            res,
            next,
            requestedMethod,
            requestedResourceName,
            constraint,
          );
          req.decodedToken.attributes = access.attributes;
          return next();
        }
      }
      return next(
        new Error(
          formatPermissionError(requestedMethod, requestedResourceName),
        ),
      );
    }
    return next(new Error('No permissions found'));
  };
}

export default accessControl;

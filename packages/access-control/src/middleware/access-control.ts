import { Response } from 'express';

function acFilterAttributes(body: any, req: any, res: Response): any {
  if (
    'decodedToken' in req &&
    'attributes' in req.decodedToken &&
    'data' in body
  ) {
    const attributes = req.decodedToken.attributes.split(' ');
    const resource = Object.keys(body.data)[0];
    const data = body.data[resource];
    const isArr = Array.isArray(body.data[resource]);
    const tmpBody: any = Array.isArray(data) ? data.slice() : [data];

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < attributes.length; j += 1) {
        if (attributes[j].charAt(0) === '!') {
          if (attributes[j].charAt(1) === '*') {
            tmpBody[i] = {};
          } else {
            delete tmpBody[i][attributes[j].substr(1)];
          }
        } else if (attributes[j].charAt(1) === '*') {
          tmpBody[i] = data[i];
        } else {
          tmpBody[i][attributes[j]] = data[i][attributes[j]];
        }
      }
    }

    // eslint-disable-next-line no-param-reassign
    body.data[resource] = isArr ? tmpBody : tmpBody[0];
  }
  return body;
}

export default acFilterAttributes;

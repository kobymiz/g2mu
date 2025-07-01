import { sign } from 'jsonwebtoken';
import { jwtSecretAsync } from './secret';

export const signAsync = async (payload: Record<PropertyKey, unknown>) => {
  const secret = await jwtSecretAsync();
  return new Promise<string>((resolve, reject) => {
    sign(
      payload,
      secret,
      {
        expiresIn: '1h',
        issuer: 'towersemi',
      },
      (error, token) => {
        if (error) {
          reject(error);
        }
        !token ? reject(Error('no token was generated')) : resolve(token);
      }
    );
  });
};

import { verify, JwtPayload } from 'jsonwebtoken';
import { jwtSecretAsync } from './secret';

export const verifyAsync = async (token: string) => {
  const secret = await jwtSecretAsync();
  return new Promise<JwtPayload>((resolve, reject) => {
    verify(
      token,
      secret,
      (error, decoded) => {
        if (error) {
          reject(error);
        }
        !decoded ? reject(Error('no decoded token')) : resolve(decoded as JwtPayload);
      },
    )
  })
}

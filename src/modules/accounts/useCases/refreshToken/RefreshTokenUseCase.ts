import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { AppError } from "@shared/errors/AppError";
import dayjs from "dayjs";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  expiresIn: Date;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(refreshToken: string): Promise<ITokenResponse> {
    const {
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
      secretToken,
      expiresInToken,
    } = auth;
    const { email, sub } = verify(refreshToken, secretRefreshToken) as IPayload;

    const userId = sub;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        userId,
        refreshToken
      );

    if (!userToken) {
      throw new AppError("Refresh token does not exists");
    }

    if (dayjs().isAfter(userToken.expires_date)) {
      await this.usersTokensRepository.deleteById(userToken.id);
      throw new AppError("Refresh token expires, please create a new session");
    }

    const token = sign({}, secretToken, {
      subject: userId,
      expiresIn: expiresInToken,
    });

    return { token, expiresIn: dayjs().add(15, "minute").toDate() };
  }
}

export { RefreshTokenUseCase };

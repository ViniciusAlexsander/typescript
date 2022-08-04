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
  expiresInToken: Date;
  refreshToken: string;
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

    await this.usersTokensRepository.deleteById(userToken.id);

    const newRefresh_token = sign({ email }, secretRefreshToken, {
      subject: userId,
      expiresIn: expiresInRefreshToken,
    });

    await this.usersTokensRepository.create({
      expires_date: dayjs().add(expiresRefreshTokenDays, "days").toDate(),
      refresh_token: newRefresh_token,
      user_id: userId,
    });

    const token = sign({}, secretToken, {
      subject: userId,
      expiresIn: expiresInToken,
    });

    return {
      token,
      expiresInToken: dayjs().add(15, "minute").toDate(),
      refreshToken: newRefresh_token,
    };
  }
}

export { RefreshTokenUseCase };

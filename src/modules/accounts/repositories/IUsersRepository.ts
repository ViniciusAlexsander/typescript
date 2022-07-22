import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../entities/User";

interface IUsersRepository {
  create(user: ICreateUserDTO): Promise<void>;
  findByEmailOrDriver(email: string, driverLicense: string): Promise<User>;
}

export { IUsersRepository };

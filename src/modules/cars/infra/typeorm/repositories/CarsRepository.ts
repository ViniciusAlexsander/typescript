import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    name,
    brand,
    category_id,
    daily_rate,
    license_plate,
    fine_amount,
    description,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      name,
      brand,
      category_id,
      daily_rate,
      license_plate,
      fine_amount,
      description,
    });

    await this.repository.save(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({ license_plate });

    return car;
  }
}

export { CarsRepository };

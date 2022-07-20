import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({ description, name }: IRequest): Promise<void> {
    const categoriesAlreadyExist = await this.categoriesRepository.findByName(
      name
    );

    if (categoriesAlreadyExist) {
      throw new Error("Category already existsss");
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };

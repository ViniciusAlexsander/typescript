import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";

interface IRequest {
  name: string;
  description: string;
}

class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async execute({ description, name }: IRequest): Promise<void> {
    const categoriesAlreadyExist = await this.categoriesRepository.findByName(
      name
    );

    if (categoriesAlreadyExist) {
      throw new Error("Category already exists");
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };

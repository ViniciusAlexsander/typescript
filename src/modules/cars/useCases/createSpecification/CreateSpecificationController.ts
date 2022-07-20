import { Request, Response } from "express";
import { CreateSpecificationUseCase } from "./CreateSpecificationUseCase";
import { container } from "tsyringe";

class CreateSpecificationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body;

    const createSpecificationUseCase = container.resolve(
      CreateSpecificationUseCase
    );
    try {
      await createSpecificationUseCase.execute({ name, description });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).send();
  }
}

export { CreateSpecificationController };

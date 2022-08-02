import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

class ListAvailableCarsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, brand, category_id } = req.body;
    const listCarsUseCase = container.resolve(ListAvailableCarsUseCase);

    const all = await listCarsUseCase.execute({ name, brand, category_id });

    return res.json(all);
  }
}

export { ListAvailableCarsController };

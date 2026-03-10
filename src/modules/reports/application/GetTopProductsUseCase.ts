import { ReportsRepository } from "../domain/ReportsRepository";
import { TopProductRow } from "../domain/ReportsModels";

export class GetTopProductsUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async execute(input: {
    companyId: string;
    from: Date;
    to: Date;
    limit: number;
  }): Promise<TopProductRow[]> {
    return this.reportsRepository.getTopProducts(input);
  }
}

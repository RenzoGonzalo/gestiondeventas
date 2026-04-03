import { ReportsRepository } from "../domain/ReportsRepository";
import { LowStockRow } from "../domain/ReportsModels";

export class GetLowStockUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async execute(input: { companyId: string; limit: number }): Promise<LowStockRow[]> {
    return this.reportsRepository.getLowStock(input);
  }
}

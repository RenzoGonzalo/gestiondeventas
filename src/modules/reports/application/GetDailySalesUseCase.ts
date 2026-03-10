import { ReportsRepository } from "../domain/ReportsRepository";
import { DailySalesRow } from "../domain/ReportsModels";

export class GetDailySalesUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async execute(input: { companyId: string; from: Date; to: Date }): Promise<DailySalesRow[]> {
    return this.reportsRepository.getDailySales(input);
  }
}

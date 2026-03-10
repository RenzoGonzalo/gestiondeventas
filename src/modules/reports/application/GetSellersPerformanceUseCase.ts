import { ReportsRepository } from "../domain/ReportsRepository";
import { SellerPerformanceRow } from "../domain/ReportsModels";

export class GetSellersPerformanceUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async execute(input: {
    companyId: string;
    from: Date;
    to: Date;
    limit: number;
  }): Promise<SellerPerformanceRow[]> {
    return this.reportsRepository.getSellersPerformance(input);
  }
}

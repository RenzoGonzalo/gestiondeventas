import { ReportsRepository } from "../domain/ReportsRepository";
import { DashboardReport } from "../domain/ReportsModels";

export class GetDashboardUseCase {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async execute(input: { companyId: string }): Promise<DashboardReport> {
    return this.reportsRepository.getDashboard(input);
  }
}

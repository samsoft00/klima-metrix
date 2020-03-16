import { EProcessStage } from '../enums/EProcessStage';

export default interface CustomerResponse {
  processId: string;
  stage: EProcessStage;
  startTime: Date;
  endTime: Date | null;
}

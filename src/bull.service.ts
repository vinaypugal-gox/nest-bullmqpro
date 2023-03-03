import { Injectable } from "@nestjs/common";
import { QueuePro as Queue, QueueEventsPro as QueueEvents, WorkerPro as Worker } from "@taskforcesh/bullmq-pro";
@Injectable()
export class BullService {
  public queues: Record<string, Queue> = {};

  public workers: Record<string, Worker> = {};

  public queueEvents: Record<string, QueueEvents> = {};

  public async waitUntilReady(): Promise<void> {
    for (const instance of [
      ...Object.values(this.queues),
      ...Object.values(this.workers),
      ...Object.values(this.queueEvents),
    ]) {
      await instance.waitUntilReady();
    }
  }

  public async close(): Promise<void> {
    for (const instance of [
      ...Object.values(this.queues),
      ...Object.values(this.workers),
      ...Object.values(this.queueEvents),
    ]) {
      await instance.close();
    }
  }
}

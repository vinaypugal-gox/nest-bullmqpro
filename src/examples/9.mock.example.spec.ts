import { Injectable, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JobPro as Job, QueuePro as Queue } from "@taskforcesh/bullmq-pro";
import { BullQueueInject, BullWorker, BullWorkerProcess } from "../bull.decorator";
import { BullModule } from "../bull.module";
import { createQueueEvents } from "../bull.utils";
const queueName = "mockExample";

@BullWorker({ queueName })
export class TestBullWorker {
  @BullWorkerProcess()
  public async process(job: Job): Promise<{ status: string }> {
    expect(job.data).toStrictEqual({ test: "test" });
    return { status: "ok" };
  }
}

@Injectable()
export class TestService {
  constructor(@BullQueueInject(queueName) public readonly queue: Queue) {}

  public async addJob(): Promise<Job> {
    return this.queue.add("job", { test: "test" });
  }
}

@Module({
  imports: [BullModule.registerQueue(queueName)],
  providers: [TestBullWorker, TestService],
})
export class TestModule {}

@Module({
  imports: [
    BullModule.forRoot({
      mock: true,
    }),
    TestModule,
  ],
})
export class ApplicationModule {}

describe("Mock Example", () => {
  it("test", async () => {
    const app = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();
    await app.init();
    const service = app.get<TestService>(TestService);
    expect(service).toBeDefined();
    expect(service.queue).toBeDefined();
    const job = await service.addJob();
    const events = await createQueueEvents(queueName);
    await job.waitUntilFinished(events);
    await events.close();
    await app.close();
  });
});

# nest-bullmqpro

## Description

The BullMQ Pro module for [Nest](https://github.com/nestjs/nest).
This package is based on [@anchan828/nest-bullmq](https://github.com/anchan828/nest-bull)

## Installation

```bash
$ npm i --save nest-bullmqpro
```

## Quick Start

### Import BullModule

```ts
import { BullModule } from "nest-bullmqpro";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    BullModule.forRoot({
      options: {
        connection: {
          host: "127.0.0.1",
        },
      },
    }),
  ],
})
export class AppModule {}
```

### Create queue provider

```ts
import { Module } from "@nestjs/common";
import { ExampleService } from "./example.service";
import { APP_QUEUE } from "./app.constants";

@Module({
  imports: [BullModule.registerQueue(APP_QUEUE)],
  providers: [ExampleService],
})
export class ExampleModule {}
```

#### With queue options

```ts
import { Module } from "@nestjs/common";
import { ExampleService } from "./example.service";
import { APP_QUEUE } from "./app.constants";

@Module({
  imports: [
    BullModule.registerQueue({
      queueName,
      options: {
        defaultJobOptions: { priority: 1 },
      },
    }),
  ],
  providers: [ExampleService],
})
export class ExampleModule {}
```

### Inject Queue provider

```ts
import { Inject, Injectable } from "@nestjs/common";
import { Queue } from "@taskforcesh/bullmq-pro";
import { APP_QUEUE } from "./app.constants";
import { BullQueueInject } from "nest-bullmqpro";

@Injectable()
export class ExampleService {
  constructor(
    @BullQueueInject(APP_QUEUE)
    private readonly queue: Queue,
  ) {}

  async addJob(): Promise<Job> {
    return this.queue.add("example", { text: "text" });
  }
}
```

### Create worker provider

```ts
import { BullWorker, BullWorkerProcess } from "nest-bullmqpro";
import { APP_QUEUE } from "./app.constants";

@BullWorker({ queueName: APP_QUEUE })
export class ExampleBullWorker {
  @BullWorkerProcess()
  public async process(job: Job): Promise<{ status: string }> {
    return { status: "ok" };
  }
}
```

### Add Worker/Queue/QueueEvents listeners

Listeners can be added via the decorator.

#### Worker listeners

All event names can be found [here](https://github.com/taskforcesh/bullmq/blob/6ded7bae22b0f369ebb68960d48780f547d43346/src/classes/worker.ts#L31).

```ts
import { BullWorker, BullWorkerProcess, BullWorkerListener, BullWorkerListenerArgs } from "nest-bullmqpro";
import { APP_QUEUE } from "./app.constants";

@BullWorker({ queueName: APP_QUEUE })
export class ExampleBullWorker {
  @BullWorkerProcess()
  public async process(job: Job): Promise<{ status: string }> {
    return { status: "ok" };
  }

  @BullWorkerListener("completed")
  public async completed(job: BullWorkerListenerArgs["completed"]): Promise<void> {
    calledEvents("completed");
    console.debug(`[${job.id}] completed`);
  }
}
```

#### Queue listeners

All event names can be found [here](https://github.com/taskforcesh/bullmq/blob/6ded7bae22b0f369ebb68960d48780f547d43346/src/classes/queue.ts#L11).

```ts
import { BullQueue, BullQueueListener, BullQueueListenerArgs } from "nest-bullmqpro";
import { APP_QUEUE } from "./app.constants";

@BullQueue({ queueName: APP_QUEUE })
export class ExampleBullQueue {
  @BullQueueListener("waiting")
  public async waiting(job: BullQueueListenerArgs["waiting"]): Promise<void> {
    calledEvents("waiting");
    console.debug(`[${job.id}] waiting`);
  }
}
```

#### QueueEvents listeners

All event names can be found [here](https://github.com/taskforcesh/bullmq/blob/6ded7bae22b0f369ebb68960d48780f547d43346/src/classes/queue-events.ts#L12).

```ts
import { BullQueueEvents, BullQueueEventsListener, BullQueueEventsListenerArgs } from "nest-bullmqpro";
import { APP_QUEUE } from "./app.constants";

@BullQueueEvents({ queueName: APP_QUEUE })
export class ExampleBullQueueEvents {
  @BullQueueEventsListener("added")
  public async added(args: BullQueueEventsListenerArgs["added"]): Promise<void> {
    console.debug(`[${args.jobId}] added`);
  }

  @BullQueueEventsListener("active")
  public async active(args: BullQueueEventsListenerArgs["active"]): Promise<void> {
    console.debug(`[${args.jobId}] active`);
  }

  @BullQueueEventsListener("completed")
  public async completed(args: BullQueueEventsListenerArgs["completed"]): Promise<void> {
    console.debug(`[${args.jobId}] completed`);
  }

  @BullQueueEventsListener("waiting")
  public async waiting(args: BullQueueEventsListenerArgs["waiting"]): Promise<void> {
    console.debug(`[${args.jobId}] waiting`);
  }
}
```

## Examples

There are [examples](./src/examples).

## License

[MIT](LICENSE)

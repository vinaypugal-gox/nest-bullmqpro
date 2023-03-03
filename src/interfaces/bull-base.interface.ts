import { Injectable } from "@nestjs/common/interfaces";
import { ProcessorPro as Processor } from "@taskforcesh/bullmq-pro";

export interface BullBaseMetadata<Options, EventType> {
  instance: Injectable;
  options: Options;
  events: EventType[];
}

export interface BullProcessMetadata<Type> {
  type: Type;
  processor: Processor | any;
}

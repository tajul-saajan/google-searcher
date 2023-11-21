import { OnEvent } from '@nestjs/event-emitter';
import { FileUploadedEvent } from '../events/file-uploaded.event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchListener {
  @OnEvent('file.uploaded', { async: true })
  handleOrderCreatedEvent(payload: FileUploadedEvent) {
    console.log(payload.keywords, 'event fired');
  }
}

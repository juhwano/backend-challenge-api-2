import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validatePhoneNumber } from '../../../utils/phone-number-validator';

@Injectable()
export class PhoneNumberValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return validatePhoneNumber(value);
  }
}
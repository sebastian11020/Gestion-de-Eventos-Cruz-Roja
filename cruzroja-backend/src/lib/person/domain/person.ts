import { IdPerson } from './value-objects/id/id.vo';
import { DocumentId } from './value-objects/document/document-id.vo';
import { FullName } from './value-objects/name/name.vo';
import { EmailVo } from './value-objects/email/email.vo';
import { PhoneVo } from './value-objects/phone/phone.vo';

export class Person {
  id: IdPerson;
  document: DocumentId;
  name: FullName;
  email: EmailVo;
  phone: PhoneVo;
  emergencyPhone: PhoneVo;
}

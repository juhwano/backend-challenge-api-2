import { Entity, PrimaryKey } from '@mikro-orm/core';

@Entity({ tableName: 'inquiry' })
export class InquiryEntity {
  @PrimaryKey({ name: 'id' })
  id?: number;

  /**
   * TODO : 구현 필요
   */
}

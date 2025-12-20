/**
 * 内容状态枚举
 */
export enum ContentStatus {
  /** 草稿 */
  DRAFT = 0,
  /** 待审核 */
  PENDING_REVIEW = 1,
  /** 已审核 */
  REVIEWED = 2,
  /** 已发布 */
  PUBLISHED = 3,
  /** 已驳回 */
  REJECTED = 4,
}

export enum Target {
  Article = 1,
  Comment = 2,
}

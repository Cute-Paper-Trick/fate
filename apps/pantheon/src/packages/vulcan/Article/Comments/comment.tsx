// import { createStyles } from 'antd-style';
// import { CircleMinus } from 'lucide-react';
// import { type PropsWithChildren, memo, useMemo, useState } from 'react';

// import {
//   V1CommentInfo,
//   useCommentLikeLike,
//   useCommentLikeUnlike,
//   useCommentsCreate,
// } from '@/lib/http';
// import { queryClient } from '@/lib/query';

// import { Target } from '../types';
// import { CommentActions } from './actions';
// import CommentMeta from './meta';

// const useStyles = createStyles(({ css }) => ({
//   comment: css`
//     display: flex;
//     flex-direction: column;

//     summary {
//       list-style: none;
//       ::-webkit-details-marker: {
//         display: none;
//       }
//     }
//   `,
//   content: css`
//     display: grid;
//     grid-template-columns: 32px 1fr;

//     font-size: 0.875rem;
//     line-height: 1.25rem;

//     padding-bottom: 0.25rem;
//     border-radius: 0.5rem;

//     position: relative;
//   `,
//   switch: css`
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     // background-color: #fff;
//     // z-index: 1;
//   `,
//   branchLine: css`
//     border-style: solid;
//     border-inline-start-width: 1px;
//     border-bottom-width: 1px;
//     border-end-start-radius: 12px;
//     width: calc(50% + 0.5px);
//     height: 1rem;
//     cursor: pointer;
//   `,
//   lineWrapper: css`
//     position: absolute;
//     justify-content: center;
//     align-items: center;
//     cursor: pointer;
//     display: flex;
//     margin-bottom: 0.75rem;
//     z-index: 0;
//     top: 0;
//     bottom: 0;

//     width: 2rem;

//     inset-inline-start: 0;
//   `,
//   threadline: css`
//     display: flex;
//     justify-content: flex-end;
//     background-color: transparent;
//     z-index: 1;
//     pointer-events: none;

//     .comment-children > div:last-child & {
//       background-color: #fff;
//       pointer-events: unset;
//     }
//   `,
//   mainThreadLine: css`
//     width: 1px;
//     height: 100%;
//     cursor: pointer;
//   `,
// }));

// type Comment = V1CommentInfo;

// // interface Comment {
// //   id: number;
// //   parentid?: number;

// //   author: string;
// //   avatar?: string;
// //   content: string;
// //   datetime: string;
// //   isOp?: boolean;
// //   children?: Comment[];
// // }

// interface CommentProps extends PropsWithChildren {
//   isChild?: boolean;
//   comment: Comment;

//   articleId: number;
//   depth?: number;
//   parentId?: number;
//   rootId?: number;
// }

// const UserComment = memo<CommentProps>(
//   ({ depth = 0, articleId, comment, rootId = 0, parentId = 0 }) => {
//     const { styles, cx } = useStyles();
//     const [open, setOpen] = useState(true);

//     const showThread = !!comment.replies?.length;

//     const [threadHover, setThreadHover] = useState(false);

//     const onHover = useMemo(
//       () =>
//         ({
//           onMouseEnter: () => setThreadHover(true),
//           onMouseLeave: () => setThreadHover(false),
//         }) as const,
//       [],
//     );

//     const refresh = () =>
//       queryClient.invalidateQueries({ queryKey: ['article', articleId, 'comments'] });

//     const likeMutation = useCommentLikeLike({
//       mutation: {
//         onSuccess: () => {
//           refresh();
//         },
//       },
//     });
//     const unLikeMutation = useCommentLikeUnlike({
//       mutation: {
//         onSuccess: () => {
//           refresh();
//         },
//       },
//     });

//     const replyMutation = useCommentsCreate({
//       mutation: {
//         onSuccess: () => {
//           refresh();
//         },
//       },
//     });

//     const onLike = () => {
//       likeMutation.mutate({ data: { comment_id: comment.id } });
//     };

//     const onUnLike = () => {
//       unLikeMutation.mutate({ data: { comment_id: comment.id } });
//     };

//     const onReply = (text: string) => {
//       replyMutation.mutate({
//         data: {
//           content: text,
//           target_id: comment.id,
//           target_type: Target.Comment,
//           parent_id: parentId,
//           root_id: rootId,
//         },
//       });
//     };

//     const enableActions = false;

//     const onFold = () => {
//       if (comment.replies.length === 0) return;
//       setOpen(false);
//     };

//     const onUnfold = () => {
//       setOpen(true);
//     };

//     return (
//       <details className={styles.comment} open={open}>
//         <summary onClick={(e) => e.preventDefault()}>
//           <CommentMeta
//             id={comment.id}
//             createAt={comment.created_at}
//             // isOp={comment.isOp}
//             onOpen={onUnfold}
//             open={open}
//             user={{
//               name: comment.creator_name,
//               avatar: comment.creator_avatar,
//             }}
//           />
//         </summary>
//         <div className={styles.content}>
//           <div className={cx(styles.lineWrapper, 'group')} {...onHover} onClick={onFold}>
//             <div
//               className={cx(
//                 showThread && styles.mainThreadLine,
//                 `group-hover:bg-[#3b4044]`,
//                 !threadHover && 'bg-[#dce0e4]',
//                 threadHover && 'bg-[#3b4044]',
//               )}
//             />
//           </div>
//           <div className={cx('contents')}>
//             <div className="grid-holder" />
//             <div>{comment.content}</div>
//           </div>
//           <div className={cx('contents')}>
//             <div className={cx(styles.switch)}>
//               <CircleMinus
//                 className={cx(!showThread && 'hidden')}
//                 fill={'#fff'}
//                 onClick={onFold}
//                 size={16}
//                 strokeWidth={1}
//                 style={{ zIndex: 1 }}
//               />
//             </div>
//             <div>
//               {enableActions && (
//                 <CommentActions
//                   liked={(comment.extra_account as any).is_liked}
//                   likedCount={comment.extra.like_count}
//                   onLike={onLike}
//                   onReply={onReply}
//                   onUnLike={onUnLike}
//                   unliked={(comment.extra_account as any).is_disliked}
//                   unlikedCount={(comment.extra as any).dislike_count}
//                 />
//               )}
//             </div>
//           </div>
//           <div
//             className={cx(
//               'comment-children',
//               'contents',
//               !threadHover && `[&>.contents>.threadline>*]:border-[#dce0e4]`,
//               threadHover && `[&>.contents>.threadline>*]:border-[#3b4044]`,
//             )}
//           >
//             {comment.replies?.map((childComment, index) => (
//               <div className={cx('contents')} key={childComment.id}>
//                 <div className={cx(styles.threadline, 'threadline')}>
//                   <div className={cx(styles.branchLine, '')} {...onHover} onClick={onFold} />
//                 </div>
//                 <UserComment
//                   articleId={articleId}
//                   comment={childComment as any}
//                   depth={depth + 1}
//                   key={index}
//                   parentId={childComment.id}
//                   rootId={rootId}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </details>
//     );
//   },
// );

// export default UserComment;

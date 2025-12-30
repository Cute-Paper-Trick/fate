// import { Input, Skeleton } from 'antd';
// import cx from 'classnames';
// import { memo } from 'react';
// import { Flexbox } from 'react-layout-kit';

// import { useArticleStore } from '@/store/article';
// import { draftSelectors } from '@/store/article/selectors';

// import CoverDragger from './CoverDragger';
// import styles from './header.module.css';
// import { useCoverUrl } from './useCoverUrl';
// import { useLayout } from './useLayout';

// export interface HeaderProps {
//   title: string;
//   description: string;
//   cover: string;
// }

// interface ArticleHeaderProps {
//   horizontal?: boolean;
//   editable?: boolean;
//   loading?: boolean;
// }

// const ArticleHeader = memo<ArticleHeaderProps>(({ editable, loading }) => {
//   // 从 store 获取状态
//   const title = useArticleStore(draftSelectors.title);
//   const description = useArticleStore(draftSelectors.description);
//   const cover = useArticleStore(draftSelectors.cover);

//   // 从 store 获取 actions
//   const updateDraftField = useArticleStore((s) => s.updateDraftField);

//   const coverUrl = useCoverUrl(cover);

//   const layout = useLayout(cover);

//   const horizontal = layout === 'horizontal';

//   if (loading) {
//     return (
//       <Flexbox className={cx(styles.header, horizontal && styles.headerRow)}>
//         <div className={styles.coverWrap}>
//           <Skeleton.Image active className={styles.cover} style={{ width: 400, height: 200 }} />
//         </div>
//         <div className={cx(styles.headerContent, 'headerContent')}>
//           <Flexbox className={cx(styles.headerContentInner)}>
//             <Flexbox className={cx(styles.titleGroup, 'titleGroup')}>
//               <Skeleton.Input active className={styles.title} />
//               <Skeleton.Input active className={styles.abstract} />
//             </Flexbox>
//           </Flexbox>
//         </div>
//       </Flexbox>
//     );
//   }

//   return (
//     <Skeleton loading={loading}>
//       <Flexbox className={cx(styles.header, horizontal && styles.headerRow)}>
//         <div className={styles.coverWrap}>
//           <CoverDragger
//             cover={coverUrl}
//             editable={editable}
//             onSuccess={(coverPath) => {
//               updateDraftField('cover', coverPath);
//             }}
//           />
//         </div>
//         <div className={cx(styles.headerContent, 'headerContent')}>
//           <Flexbox className={cx(styles.headerContentInner)}>
//             <Flexbox className={cx(styles.titleGroup, 'titleGroup')}>
//               {editable ? (
//                 <div>
//                   <Input.TextArea
//                     autoSize
//                     className={styles.title}
//                     onChange={(e) => {
//                       updateDraftField('title', e.target.value);
//                     }}
//                     placeholder="输入标题"
//                     value={title}
//                     variant="borderless"
//                   />
//                   <Input.TextArea
//                     autoSize
//                     className={styles.abstract}
//                     onChange={(e) => {
//                       updateDraftField('description', e.target.value);
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         e.preventDefault();
//                       }
//                     }}
//                     placeholder="输入摘要"
//                     value={description}
//                     variant="borderless"
//                   />
//                 </div>
//               ) : (
//                 <>
//                   <div className={styles.title}>{title}</div>
//                   <p className={styles.abstract}>{description}</p>
//                 </>
//               )}
//             </Flexbox>
//           </Flexbox>
//         </div>
//       </Flexbox>
//     </Skeleton>
//   );
// });

// export default ArticleHeader;

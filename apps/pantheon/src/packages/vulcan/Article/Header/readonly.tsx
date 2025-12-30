// import { Avatar, Skeleton } from 'antd';
// import cx from 'classnames';
// import { memo } from 'react';
// import { Flexbox } from 'react-layout-kit';

// import { formatRelativeTime } from '@/packages/utils';

// import CoverDragger from './CoverDragger';
// import styles from './header.module.css';
// import { useCoverUrl } from './useCoverUrl';
// import { useLayout } from './useLayout';

// export interface HeaderProps {
//   title: string;
//   description: string;
//   cover: string;
//   creatorName: string;
//   creatorAvatar: string;
//   createdAt: string;

//   loading?: boolean;
// }

// const ArticleHeaderReadonly = memo<HeaderProps>(
//   ({ title, description, cover, creatorName, creatorAvatar, createdAt, loading }) => {
//     const coverUrl = useCoverUrl(cover);
//     const layout = useLayout(cover);

//     const horizontal = layout === 'horizontal';

//     if (loading) {
//       return (
//         <Flexbox className={cx(styles.header, horizontal && styles.headerRow)}>
//           <div className={styles.coverWrap}>
//             <Skeleton.Image active className={styles.cover} style={{ width: 400, height: 200 }} />
//           </div>
//           <div className={cx(styles.headerContent, 'headerContent')}>
//             <Flexbox className={cx(styles.headerContentInner)}>
//               <Flexbox className={cx(styles.titleGroup, 'titleGroup')}>
//                 <Skeleton.Input active className={styles.title} />
//                 <Skeleton.Input active className={styles.abstract} />
//               </Flexbox>
//             </Flexbox>
//           </div>
//         </Flexbox>
//       );
//     }

//     return (
//       <Skeleton loading={loading}>
//         <Flexbox className={cx(styles.header, horizontal && styles.headerRow)}>
//           <div className={styles.coverWrap}>
//             <CoverDragger cover={coverUrl} />
//           </div>
//           <div className={cx(styles.headerContent, 'headerContent')}>
//             <Flexbox className={cx(styles.headerContentInner)}>
//               <Flexbox className={cx(styles.titleGroup, 'titleGroup')}>
//                 <div className={styles.title}>{title}</div>
//                 <p className={styles.abstract}>{description}</p>
//               </Flexbox>
//               <Flexbox align="center" className={styles.meta} gap={12} horizontal>
//                 <Avatar size={40} src={creatorAvatar}>
//                   {creatorName}
//                 </Avatar>
//                 <span className={styles.userName}>{creatorName}</span>
//                 <span className={styles.createdAt}>{formatRelativeTime(createdAt)}</span>
//               </Flexbox>
//             </Flexbox>
//           </div>
//         </Flexbox>
//       </Skeleton>
//     );
//   },
// );

// export default ArticleHeaderReadonly;

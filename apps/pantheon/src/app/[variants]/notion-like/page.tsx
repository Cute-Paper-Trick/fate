//   const menu: MenuProps['items'] = [
//     { key: 'hot', label: '最热评论' },
//     { key: 'latest', label: '最新评论' },
//     { key: 'oldest', label: '最早评论' },
//   ];

//   return (
//     <section className={cx(styles.layout, styles.layoutArticle)}>
//       <aside className={styles.sideLeft}>
//         <div className={styles.articleActions}>
//           <div className={styles.articleActionsInner}>
//             <button className={styles.reaction} type="button">
//               {/* TODO action 动画 */}
//               <span className={styles.reactionIcon}>
//                 <HeartPlus />
//               </span>
//               <span className={styles.reactionCount}>{100}</span>
//             </button>

//             <button className={styles.reaction} type="button">
//               <span className={styles.reactionIcon}>
//                 <MessageCircle />
//               </span>
//               <span className={styles.reactionCount}>{100}</span>
//             </button>
//             <span />

//             <Center>
//               <span className={cx(styles.reactionIcon, styles.btn, styles.rounded)}>
//                 <Ellipsis />
//               </span>
//             </Center>
//           </div>
//         </div>
//       </aside>
//   );
// }

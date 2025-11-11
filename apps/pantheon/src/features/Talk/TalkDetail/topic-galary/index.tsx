'use client';
// import { Image } from "antd";
import { Image } from '@lobehub/ui';
import { useRef } from 'react';

import styles from './topic-gallery.module.scss';

// interface ArrowProps {
//   className?: string;
//   currentSlide?: number;
//   date_role?: string;
//   onClick?: () => void;
//   slideCount?: number;
//   style?: React.CSSProperties;
// }

// function PrevArrow(props: ArrowProps) {
//   const { currentSlide, slideCount, className, ...resetProps } = props;
//   return (
//     <button
//       {...resetProps}
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       currentslide={currentSlide}
//       slidecount={slideCount}
//       className={clsx(className, styles.arrowBtn)}
//     ></button>
//   );
// }

// function NextArrow(props: ArrowProps) {
//   const { currentSlide, slideCount, className, ...resetProps } = props;
//   return (
//     <button
//       {...resetProps}
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       currentslide={currentSlide}
//       slidecount={slideCount}
//       className={clsx(className, styles.arrowBtn)}
//     ></button>
//   );
// }

interface TopicGalleryProps {
  images: { thumbnail: string; origin: string }[];
}

export function TopicGallery({ images }: TopicGalleryProps) {
  // const sliderSetting = useMemo<SliderSetting>(
  //   () => ({
  //     dots: true,
  //     infinite: true,
  //     speed: 500,
  //     slidesToShow: 1,
  //     slidesToScroll: 1,
  //     accessibility: false,
  //     prevArrow: <PrevArrow />,
  //     nextArrow: <NextArrow />,
  //     adaptiveHeight: false,
  //   }),
  //   []
  // );

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.gallery} ref={ref}>
      <Image.PreviewGroup preview={{ getContainer: () => ref.current! }}>
        {images.map((img) => (
          <div className={styles.img_wrapper} key={img.thumbnail}>
            <Image className={styles.img} preview={{ src: img.origin }} src={img.thumbnail} />
          </div>
        ))}
      </Image.PreviewGroup>
      {/* <Slider {...sliderSetting}>
        {images.map((img) => (
          <div className={styles.gallery_item} key={img}>
            <div className={styles.gallery_item_inner}>
              <Image src={img} preview={false} />
            </div>
          </div>
        ))}
      </Slider> */}
    </div>
  );
}

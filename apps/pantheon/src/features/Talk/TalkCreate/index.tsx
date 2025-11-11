'use client';
import { Modal } from 'antd';

import { TopicCreate } from './topic-create';
import styles from './topic-create.module.scss';

interface TopicCreateModalProps {
  open: boolean;
  onCreated: () => void;
  onCancel: () => void;
}

export function TopicCreateModal({ open, onCreated }: TopicCreateModalProps) {
  return (
    <Modal
      centered
      className={styles.modalBox}
      closeIcon={null}
      footer={false}
      open={open}
      width={800}
    >
      <TopicCreate onChange={onCreated} />
    </Modal>
  );
}

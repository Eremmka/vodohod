import { DropletIcon } from './icons';
import styles from './TruckIllustration.module.scss';

export default function TruckIllustration() {
  return (
    <div
      className={styles.scene}
      aria-label="Иллюстрация водовоза ВодоХод"
      role="img"
    >
      <div className={`${styles.cloud} ${styles.cloudA}`} />
      <div className={`${styles.cloud} ${styles.cloudB}`} />
      <div className={styles.haze} />
      <div className={styles.road} />

      <div className={styles.truck}>
        <div className={styles.cab}>
          <div className={styles.window} />

          <div className={styles.grill}>
            <span />
            <span />
            <span />
          </div>

          <div className={styles.light} />

          <div className={`${styles.wheel} ${styles.wheelCab}`} />
        </div>

        <div className={styles.tank}>
          <div className={styles.tankTop} />
          <div className={styles.tankBand} />

          <div className={styles.tankBrand}>
            <DropletIcon size={34} />

            <div>
              <strong>ВодоХод</strong>
              <small>доставка воды</small>
            </div>
          </div>

          <div className={styles.capacity}>8 м³</div>
        </div>

        <div className={`${styles.wheel} ${styles.wheelRear}`} />
      </div>

      <div className={`${styles.waterDrop} ${styles.dropOne}`} />
      <div className={`${styles.waterDrop} ${styles.dropTwo}`} />
      <div className={`${styles.waterDrop} ${styles.dropThree}`} />
    </div>
  );
}
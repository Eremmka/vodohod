'use client';

import {
  CircleMarker,
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
} from 'react-leaflet';

import type { LatLngExpression } from 'leaflet';

import styles from './ServiceAreaMap.module.scss';

const CARTO_API_KEY =
  process.env.NEXT_PUBLIC_CARTO_API_KEY || '';

type AreaPoint = {
  name: string;
  position: LatLngExpression;
};

/*
 * ОСНОВНАЯ ЗОНА
 *
 * Контур сформирован по направлениям,
 * которые ты указал:
 * север Санкт-Петербурга →
 * Елизаветинка →
 * Лесколово →
 * Новое Токсово →
 * Токсово.
 *
 * Западная часть ориентирована в сторону ЗСД.
 */

const mainZone: LatLngExpression[] = [
  [60.285, 30.17], // северо-запад
  [60.295, 30.30],
  [60.29, 30.46],
  [60.265, 30.55],
  [60.215, 30.59],
  [60.155, 30.56], // Токсово
  [60.11, 30.52],
  [60.055, 30.48], // Ручьи / восток СПб
  [60.015, 30.44],
  [60.005, 30.36], // Площадь Мужества
  [60.015, 30.30], // Пионерская
  [60.025, 30.22], // западная граница
  [60.10, 30.16],
  [60.19, 30.14],
  [60.25, 30.15],
];

/*
 * РАСШИРЕННАЯ ЗОНА
 *
 * Здесь можно приехать севернее
 * основной зоны, но уже по договорённости.
 */
const agreementZone: LatLngExpression[] = [
  [60.35, 29.88],
  [60.36, 30.20],
  [60.35, 30.52],
  [60.34, 30.78],
  [60.20, 30.78],
  [60.10, 30.68],
  [60.00, 30.58],
  [59.94, 30.18],
  [59.97, 29.92],
];

/*
 * Основные ориентиры.
 */
const mainPoints: AreaPoint[] = [
  {
    name: 'Пионерская',
    position: [60.00248, 30.29681],
  },
  {
    name: 'Площадь Мужества',
    position: [59.99831, 30.36369],
  },
  {
    name: 'Кондратьевский проспект',
    position: [59.96861, 30.38444],
  },
  {
    name: 'Пискарёвка',
    position: [59.986, 30.414],
  },
  {
    name: 'Ручьи',
    position: [60.016, 30.466],
  },
  {
    name: 'Елизаветинка',
    position: [60.26741, 30.21893],
  },
  {
    name: 'Лесколово',
    position: [60.25579, 30.42893],
  },
  {
    name: 'Новое Токсово',
    position: [60.20443, 30.56146],
  },
  {
    name: 'Токсово',
    position: [60.15323, 30.51646],
  },
];

/*
 * По договорённости.
 */
const agreementPoints: AreaPoint[] = [
  {
    name: 'Белоостров',
    position: [60.14722, 30.0125],
  },
];

/*
 * Не обслуживаем.
 */
const excludedPoints: AreaPoint[] = [
  {
    name: 'Всеволожск',
    position: [60.02132, 30.65408],
  },
];

export default function ServiceAreaMap() {
  const tileUrl = CARTO_API_KEY
    ? `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(
        CARTO_API_KEY,
      )}`
    : '';

  return (
    <div className={styles.map}>
      {tileUrl ? (
        <MapContainer
          className={styles.leafletMap}
          center={[60.13, 30.38]}
          zoom={10}
          minZoom={9}
          maxZoom={16}
          scrollWheelZoom
          zoomControl
        >
          <TileLayer
            url={tileUrl}
            maxZoom={20}
            attribution='© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions/" target="_blank" rel="noreferrer">CARTO</a>'
          />

          {/* ЖЁЛТАЯ — расширенная зона */}
          <Polygon
            positions={agreementZone}
            pathOptions={{
              color: '#d9a800',
              weight: 2,
              opacity: 0.65,
              fillColor: '#f4d35e',
              fillOpacity: 0.18,
            }}
          />

          {/* СИНЯЯ — основная зона */}
          <Polygon
            positions={mainZone}
            pathOptions={{
              color: '#0877c9',
              weight: 2.5,
              opacity: 0.9,
              fillColor: '#1598ee',
              fillOpacity: 0.22,
            }}
          >
            <Tooltip
              sticky
            >
              Основная зона доставки
            </Tooltip>
          </Polygon>

          {/* Основные точки */}
          {mainPoints.map((point) => (
            <CircleMarker
              key={point.name}
              center={point.position}
              radius={6}
              pathOptions={{
                color: '#0877c9',
                weight: 2,
                fillColor: '#1598ee',
                fillOpacity: 0.95,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -6]}
              >
                {point.name}
              </Tooltip>
            </CircleMarker>
          ))}

          {/* По договорённости */}
          {agreementPoints.map((point) => (
            <CircleMarker
              key={point.name}
              center={point.position}
              radius={8}
              pathOptions={{
                color: '#b08300',
                weight: 2.5,
                fillColor: '#f4c542',
                fillOpacity: 0.98,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
              >
                {point.name} · по договорённости
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Не обслуживаем */}
          {excludedPoints.map((point) => (
            <CircleMarker
              key={point.name}
              center={point.position}
              radius={8}
              pathOptions={{
                color: '#b53131',
                weight: 2.5,
                fillColor: '#e45b5b',
                fillOpacity: 0.98,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
              >
                {point.name} · не обслуживаем
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      ) : (
        <div className={styles.mapError}>
          <strong>
            Карта временно недоступна
          </strong>

          <span>
            Не настроен ключ картографии.
          </span>
        </div>
      )}

      {/* Легенда */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>
          Зона работы
        </div>

        <div className={styles.legendItem}>
          <span
            className={`${styles.legendDot} ${styles.legendMain}`}
          />

          Основная зона
        </div>

        <div className={styles.legendItem}>
          <span
            className={`${styles.legendDot} ${styles.legendAgreement}`}
          />

          По договорённости
        </div>

        <div className={styles.legendItem}>
          <span
            className={`${styles.legendDot} ${styles.legendExcluded}`}
          />

          Не обслуживаем
        </div>
      </div>

      <div className={styles.mapNote}>
        Основная зона отмечена голубым.
        <strong>
          {' '}
          Севернее — по договорённости.
        </strong>
      </div>
    </div>
  );
}
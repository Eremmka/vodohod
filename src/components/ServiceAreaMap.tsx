'use client';

import {
  CircleMarker,
  MapContainer,
  Polyline,
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

const agreementPoints: AreaPoint[] = [
  {
    name: 'Белоостров',
    position: [60.14722, 30.0125],
  },
];

const excludedPoints: AreaPoint[] = [
  {
    name: 'Всеволожск',
    position: [60.02132, 30.65408],
  },
];

const routeLine: LatLngExpression[] = [
  [60.00248, 30.29681],
  [59.99831, 30.36369],
  [59.96861, 30.38444],
  [59.986, 30.414],
  [60.016, 30.466],
  [60.20443, 30.56146],
  [60.15323, 30.51646],
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
          center={[60.12, 30.36]}
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

          <Polyline
            positions={routeLine}
            pathOptions={{
              color: '#1598ee',
              weight: 5,
              opacity: 0.35,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />

          {mainPoints.map((point) => (
            <CircleMarker
              key={point.name}
              center={point.position}
              radius={7}
              pathOptions={{
                color: '#0877c9',
                weight: 3,
                fillColor: '#1598ee',
                fillOpacity: 0.95,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -7]}
                permanent
              >
                {point.name}
              </Tooltip>
            </CircleMarker>
          ))}

          {agreementPoints.map((point) => (
            <CircleMarker
              key={point.name}
              center={point.position}
              radius={8}
              pathOptions={{
                color: '#a77900',
                weight: 3,
                fillColor: '#f4c542',
                fillOpacity: 0.95,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
                permanent
              >
                {point.name} · по договорённости
              </Tooltip>
            </CircleMarker>
          ))}

          {excludedPoints.map((point) => (
            <CircleMarker
              key={point.name}
              center={point.position}
              radius={8}
              pathOptions={{
                color: '#b53131',
                weight: 3,
                fillColor: '#e45b5b',
                fillOpacity: 0.95,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
                permanent
              >
                {point.name} · не обслуживаем
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      ) : (
        <div className={styles.mapError}>
          <strong>Карта временно недоступна</strong>
          <span>
            Не настроен ключ картографии.
          </span>
        </div>
      )}

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
        Севернее основной зоны также можем приехать
        <strong> по договорённости.</strong>
      </div>
    </div>
  );
}
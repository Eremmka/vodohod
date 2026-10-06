'use client';

import { useEffect, useRef } from 'react';
import styles from './YandexMap.module.scss';

const API_KEY =
  process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';

type YMapsApi = {
  ready: Promise<void>;

  import: (
    moduleName: string,
  ) => Promise<Record<string, unknown>>;

  YMap: new (
    element: HTMLElement,
    props: {
      location: {
        center: [number, number];
        zoom: number;
      };
      showScaleInCopyrights?: boolean;
    },
    children?: unknown[],
  ) => {
    addChild: (child: unknown) => unknown;
    removeChild?: (child: unknown) => unknown;
  };

  YMapDefaultSchemeLayer: new (
    props?: Record<string, unknown>,
  ) => unknown;

  YMapDefaultFeaturesLayer: new (
    props?: Record<string, unknown>,
  ) => unknown;

  YMapFeature: new (
    props: {
      geometry: {
        type: 'Polygon';
        coordinates: number[][][];
      };
      style: {
        fill: string;
        stroke?: Array<{
          width: number;
          color: string;
        }>;
      };
    },
  ) => unknown;

  YMapMarker: new (
    props: {
      coordinates: [number, number];
    },
    element: HTMLElement,
  ) => unknown;

  YMapControls: new (
    props: {
      position: string;
    },
    children?: unknown[],
  ) => {
    addChild: (child: unknown) => unknown;
  };
};

declare global {
  interface Window {
    ymaps3?: YMapsApi;
  }
}

let yandexMapsPromise: Promise<YMapsApi> | null = null;

function loadYandexMaps(): Promise<YMapsApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new Error('Yandex Maps can only run in the browser'),
    );
  }

  if (!API_KEY) {
    return Promise.reject(
      new Error('Yandex Maps API key is missing'),
    );
  }

  if (window.ymaps3) {
    return window.ymaps3.ready.then(() => window.ymaps3!);
  }

  if (yandexMapsPromise) {
    return yandexMapsPromise;
  }

  yandexMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-yandex-maps]',
    );

    const handleLoad = () => {
      if (!window.ymaps3) {
        reject(
          new Error(
            'Yandex Maps API did not initialize',
          ),
        );
        return;
      }

      window.ymaps3.ready
        .then(() => resolve(window.ymaps3!))
        .catch(reject);
    };

    if (existingScript) {
      existingScript.addEventListener(
        'load',
        handleLoad,
        { once: true },
      );

      existingScript.addEventListener(
        'error',
        () =>
          reject(
            new Error(
              'Failed to load Yandex Maps API',
            ),
          ),
        { once: true },
      );

      return;
    }

    const script =
      document.createElement('script');

    script.src =
      `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(
        API_KEY,
      )}&lang=ru_RU`;

    script.async = true;
    script.dataset.yandexMaps = 'true';

    script.addEventListener(
      'load',
      handleLoad,
      { once: true },
    );

    script.addEventListener(
      'error',
      () =>
        reject(
          new Error(
            'Failed to load Yandex Maps API',
          ),
        ),
      { once: true },
    );

    document.head.appendChild(script);
  });

  return yandexMapsPromise;
}

const mainZone: number[][] = [
  [30.215, 59.995],
  [30.285, 59.985],
  [30.365, 59.985],
  [30.435, 60.015],
  [30.505, 60.075],
  [30.57, 60.145],
  [30.59, 60.19],
  [30.565, 60.225],
  [30.50, 60.275],
  [30.41, 60.29],
  [30.31, 60.29],
  [30.235, 60.275],
  [30.19, 60.23],
  [30.16, 60.17],
  [30.18, 60.08],
];

const agreementZone: number[][] = [
  [29.88, 59.98],
  [30.10, 59.94],
  [30.22, 59.93],
  [30.34, 59.94],
  [30.48, 59.98],
  [30.61, 60.04],
  [30.72, 60.11],
  [30.79, 60.20],
  [30.80, 60.30],
  [30.72, 60.37],
  [30.52, 60.40],
  [30.27, 60.39],
  [30.08, 60.34],
  [29.94, 60.27],
  [29.88, 60.16],
];

type PointData = {
  name: string;
  coordinates: [number, number];
  type: 'main' | 'agreement' | 'excluded';
};

const points: PointData[] = [
  {
    name: 'Пионерская',
    coordinates: [30.29681, 60.00248],
    type: 'main',
  },
  {
    name: 'Площадь Мужества',
    coordinates: [30.36369, 59.99831],
    type: 'main',
  },
  {
    name: 'Кондратьевский проспект',
    coordinates: [30.38444, 59.96861],
    type: 'main',
  },
  {
    name: 'Пискарёвка',
    coordinates: [30.414, 59.986],
    type: 'main',
  },
  {
    name: 'Ручьи',
    coordinates: [30.466, 60.016],
    type: 'main',
  },
  {
    name: 'Елизаветинка',
    coordinates: [30.21893, 60.26741],
    type: 'main',
  },
  {
    name: 'Лесколово',
    coordinates: [30.42893, 60.25579],
    type: 'main',
  },
  {
    name: 'Новое Токсово',
    coordinates: [30.56146, 60.20443],
    type: 'main',
  },
  {
    name: 'Токсово',
    coordinates: [30.51646, 60.15323],
    type: 'main',
  },
  {
    name: 'Белоостров',
    coordinates: [30.0125, 60.14722],
    type: 'agreement',
  },
  {
    name: 'Всеволожск',
    coordinates: [30.65408, 60.02132],
    type: 'excluded',
  },
];

function createMarkerElement(
  point: PointData,
): HTMLDivElement {
  const wrapper =
    document.createElement('div');

  wrapper.className =
    `${styles.marker} ${styles[`marker--${point.type}`]}`;

  const dot =
    document.createElement('span');

  dot.className = styles.markerDot;

  const label =
    document.createElement('span');

  label.className = styles.markerLabel;

  label.textContent = point.name;

  wrapper.appendChild(dot);
  wrapper.appendChild(label);

  return wrapper;
}

export default function YandexMap() {
  const mapRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let map: YMapsApi['YMap'] extends new (
      ...args: never[]
    ) => infer R
      ? R
      : never;

    let entities: unknown[] = [];

    async function initMap() {
      try {
        const ymaps =
          await loadYandexMaps();

        if (
          disposed ||
          !mapRef.current
        ) {
          return;
        }

        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapFeature,
          YMapMarker,
        } = ymaps;

        const mapInstance =
          new YMap(
            mapRef.current,
            {
              location: {
                center: [
                  30.36,
                  60.13,
                ],
                zoom: 10,
              },
              showScaleInCopyrights: true,
            },
            [
              new YMapDefaultSchemeLayer(
                {},
              ),

              new YMapDefaultFeaturesLayer(
                {
                  zIndex: 1800,
                },
              ),
            ],
          );

        map =
          mapInstance as typeof map;

        const yellowPolygon =
          new YMapFeature({
            geometry: {
              type: 'Polygon',
              coordinates: [
                agreementZone,
              ],
            },
            style: {
              fill:
                'rgba(244, 196, 66, 0.20)',
              stroke: [
                {
                  width: 2,
                  color:
                    'rgba(193, 145, 0, 0.72)',
                },
              ],
            },
          });

        const bluePolygon =
          new YMapFeature({
            geometry: {
              type: 'Polygon',
              coordinates: [
                mainZone,
              ],
            },
            style: {
              fill:
                'rgba(21, 152, 238, 0.24)',
              stroke: [
                {
                  width: 2.5,
                  color:
                    'rgba(8, 119, 201, 0.95)',
                },
              ],
            },
          });

        mapInstance.addChild(
          yellowPolygon,
        );

        mapInstance.addChild(
          bluePolygon,
        );

        entities.push(
          yellowPolygon,
          bluePolygon,
        );

        points.forEach((point) => {
          const markerElement =
            createMarkerElement(
              point,
            );

          const marker =
            new YMapMarker(
              {
                coordinates:
                  point.coordinates,
              },
              markerElement,
            );

          mapInstance.addChild(
            marker,
          );

          entities.push(marker);
        });
      } catch (error) {
        console.error(
          'Yandex Maps initialization error:',
          error,
        );
      }
    }

    initMap();

    return () => {
      disposed = true;

      if (
        map &&
        typeof map.removeChild ===
          'function'
      ) {
        entities.forEach(
          (entity) => {
            try {
              map.removeChild?.(
                entity,
              );
            } catch {
              // Ignore cleanup errors.
            }
          },
        );
      }

      entities = [];
    };
  }, []);

  return (
    <div className={styles.map}>
      <div
        ref={mapRef}
        className={styles.mapCanvas}
      />

      <div className={styles.legend}>
        <div className={styles.legendTitle}>
          Зона работы
        </div>

        <div className={styles.legendItem}>
          <span
            className={`${styles.legendDot} ${styles.legendDotMain}`}
          />
          Основная зона
        </div>

        <div className={styles.legendItem}>
          <span
            className={`${styles.legendDot} ${styles.legendDotAgreement}`}
          />
          По договорённости
        </div>

        <div className={styles.legendItem}>
          <span
            className={`${styles.legendDot} ${styles.legendDotExcluded}`}
          />
          Не обслуживаем
        </div>
      </div>

      <div className={styles.mapNote}>
        Севернее основной зоны можем приехать
        <strong> по договорённости.</strong>
      </div>
    </div>
  );
}
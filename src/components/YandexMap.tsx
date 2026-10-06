'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './YandexMap.module.scss';

const API_KEY =
  process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';

type Coordinates = [number, number];

interface YMapInstance {
  addChild(child: unknown): YMapInstance;
  destroy(): void;
}

interface YMapConstructor {
  new (
    element: HTMLElement,
    props: {
      location: {
        center: Coordinates;
        zoom: number;
      };
      showScaleInCopyrights?: boolean;
    },
  ): YMapInstance;
}

interface YMapLayerConstructor {
  new (
    props?: Record<string, unknown>,
  ): unknown;
}

interface YMapFeatureConstructor {
  new (props: {
    geometry: {
      type: 'Polygon';
      coordinates: Coordinates[][];
    };
    style?: {
      fill?: string;
      stroke?: Array<{
        width: number;
        color: string;
      }>;
      simplificationRate?: number;
    };
  }): unknown;
}

interface YMapMarkerConstructor {
  new (
    props: {
      coordinates: Coordinates;
      draggable?: boolean;
    },
    element: HTMLElement,
  ): unknown;
}

interface YMaps3 {
  ready: Promise<void>;

  YMap: YMapConstructor;

  YMapDefaultSchemeLayer: YMapLayerConstructor;

  YMapDefaultFeaturesLayer: YMapLayerConstructor;

  YMapFeature: YMapFeatureConstructor;

  YMapMarker: YMapMarkerConstructor;
}

declare global {
  interface Window {
    ymaps3?: YMaps3;
  }
}

const CENTER: Coordinates = [
  30.45,
  60.05,
];

/*
 * Основная зона доставки.
 */
const MAIN_ZONE: Coordinates[] = [
  [30.05, 60.15],
  [30.12, 60.18],
  [30.22, 60.19],
  [30.32, 60.18],
  [30.45, 60.18],
  [30.57, 60.17],
  [30.70, 60.15],
  [30.82, 60.10],
  [30.88, 60.03],
  [30.84, 59.96],
  [30.74, 59.91],
  [30.62, 59.88],
  [30.48, 59.87],
  [30.34, 59.88],
  [30.20, 59.91],
  [30.08, 59.97],
  [30.02, 60.05],
  [30.05, 60.15],
];

/*
 * Дополнительная северная зона.
 * Ездим по договорённости.
 */
const AGREEMENT_ZONE: Coordinates[] = [
  [29.92, 60.28],
  [30.10, 60.31],
  [30.32, 60.32],
  [30.57, 60.30],
  [30.80, 60.27],
  [31.00, 60.19],
  [31.08, 60.08],
  [31.02, 59.98],
  [30.92, 59.88],
  [30.76, 59.78],
  [30.56, 59.76],
  [30.32, 59.78],
  [30.08, 59.84],
  [29.95, 59.96],
  [29.89, 60.10],
  [29.92, 60.28],
];

const SERVICE_POINTS: Array<{
  name: string;
  coordinates: Coordinates;
}> = [
  {
    name: 'Пионерская',
    coordinates: [
      30.3005,
      60.0022,
    ],
  },
  {
    name: 'Площадь Мужества',
    coordinates: [
      30.3695,
      60.0077,
    ],
  },
  {
    name: 'Кондратьевский проспект',
    coordinates: [
      30.3775,
      59.9868,
    ],
  },
  {
    name: 'Пискарёвка',
    coordinates: [
      30.4035,
      59.9968,
    ],
  },
  {
    name: 'Ручьи',
    coordinates: [
      30.4575,
      60.0175,
    ],
  },
  {
    name: 'Елизаветинка',
    coordinates: [
      29.9307,
      60.2244,
    ],
  },
  {
    name: 'Лесколово',
    coordinates: [
      30.5254,
      60.3198,
    ],
  },
  {
    name: 'Новое Токсово',
    coordinates: [
      30.5356,
      60.1623,
    ],
  },
  {
    name: 'Токсово',
    coordinates: [
      30.5168,
      60.1542,
    ],
  },
  {
    name: 'Белоостров',
    coordinates: [
      29.9954,
      60.1501,
    ],
  },
];

/*
 * Всеволожск — не обслуживаем.
 */
const VSEVOLOZHSK: Coordinates = [
  30.675,
  60.02,
];

function loadYandexMaps(): Promise<void> {
  return new Promise(
    (resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(
          new Error(
            'Window недоступен',
          ),
        );

        return;
      }

      if (!API_KEY) {
        reject(
          new Error(
            'Не указан NEXT_PUBLIC_YANDEX_MAPS_API_KEY',
          ),
        );

        return;
      }

      if (window.ymaps3) {
        resolve();

        return;
      }

      const existingScript =
        document.querySelector<HTMLScriptElement>(
          'script[data-yandex-maps="true"]',
        );

      if (existingScript) {
        const checkLoaded =
          () => {
            if (window.ymaps3) {
              resolve();
            } else {
              reject(
                new Error(
                  'Скрипт Яндекс.Карт загрузился, но ymaps3 не найден',
                ),
              );
            }
          };

        existingScript.addEventListener(
          'load',
          checkLoaded,
          { once: true },
        );

        existingScript.addEventListener(
          'error',
          () => {
            reject(
              new Error(
                'Не удалось загрузить API Яндекс.Карт',
              ),
            );
          },
          { once: true },
        );

        return;
      }

      const script =
        document.createElement(
          'script',
        );

      script.src =
        `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(
          API_KEY,
        )}&lang=ru_RU`;

      script.async = true;

      script.dataset.yandexMaps =
        'true';

      script.addEventListener(
        'load',
        () => {
          if (window.ymaps3) {
            resolve();
          } else {
            reject(
              new Error(
                'API Яндекс.Карт загрузился без ymaps3',
              ),
            );
          }
        },
        { once: true },
      );

      script.addEventListener(
        'error',
        () => {
          reject(
            new Error(
              'Не удалось загрузить API Яндекс.Карт',
            ),
          );
        },
        { once: true },
      );

      document.head.appendChild(
        script,
      );
    },
  );
}

function createMarkerElement(
  name: string,
  className?: string,
): HTMLElement {
  const root =
    document.createElement(
      'div',
    );

  root.className = className
    ? `${styles.marker} ${className}`
    : styles.marker;

  const dot =
    document.createElement(
      'span',
    );

  dot.className =
    styles.markerDot;

  const label =
    document.createElement(
      'span',
    );

  label.className =
    styles.markerLabel;

  label.textContent = name;

  root.appendChild(dot);
  root.appendChild(label);

  return root;
}

export default function YandexMap() {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<YMapInstance | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let cancelled = false;

    const initMap =
      async () => {
        try {
          setError(null);

          await loadYandexMaps();

          if (!window.ymaps3) {
            throw new Error(
              'Объект ymaps3 не найден',
            );
          }

          await window.ymaps3.ready;

          if (
            cancelled ||
            !mapContainerRef.current
          ) {
            return;
          }

          const {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapFeature,
            YMapMarker,
          } = window.ymaps3;

          const map =
            new YMap(
              mapContainerRef.current,
              {
                location: {
                  center: CENTER,
                  zoom: 9.3,
                },
                showScaleInCopyrights:
                  true,
              },
            );

          mapRef.current =
            map;

          /*
           * Базовый слой карты.
           */
          const schemeLayer =
            new YMapDefaultSchemeLayer(
              {},
            );

          map.addChild(
            schemeLayer,
          );

          /*
           * Слой объектов.
           */
          const featuresLayer =
            new YMapDefaultFeaturesLayer(
              {},
            );

          map.addChild(
            featuresLayer,
          );

          /*
           * Жёлтая зона:
           * дополнительные направления
           * по договорённости.
           */
          const agreementPolygon =
            new YMapFeature({
              geometry: {
                type: 'Polygon',
                coordinates: [
                  AGREEMENT_ZONE,
                ],
              },

              style: {
                fill:
                  'rgba(255, 201, 64, 0.18)',

                stroke: [
                  {
                    width: 2,
                    color:
                      'rgba(232, 164, 0, 0.9)',
                  },
                ],

                simplificationRate: 0,
              },
            });

          map.addChild(
            agreementPolygon,
          );

          /*
           * Синяя зона:
           * основная зона доставки.
           */
          const mainPolygon =
            new YMapFeature({
              geometry: {
                type: 'Polygon',
                coordinates: [
                  MAIN_ZONE,
                ],
              },

              style: {
                fill:
                  'rgba(21, 152, 238, 0.23)',

                stroke: [
                  {
                    width: 3,
                    color:
                      'rgba(21, 152, 238, 0.95)',
                  },
                ],

                simplificationRate: 0,
              },
            });

          map.addChild(
            mainPolygon,
          );

          /*
           * Основные населённые пункты
           * и районы обслуживания.
           */
          SERVICE_POINTS.forEach(
            (
              point,
            ) => {
              const element =
                createMarkerElement(
                  point.name,
                );

              const marker =
                new YMapMarker(
                  {
                    coordinates:
                      point.coordinates,
                  },
                  element,
                );

              map.addChild(
                marker,
              );
            },
          );

          /*
           * Всеволожск.
           */
          const vsevolozhskElement =
            createMarkerElement(
              'Всеволожск — не обслуживаем',
              styles.markerDanger,
            );

          const vsevolozhskMarker =
            new YMapMarker(
              {
                coordinates:
                  VSEVOLOZHSK,
              },
              vsevolozhskElement,
            );

          map.addChild(
            vsevolozhskMarker,
          );
        } catch (err) {
          console.error(
            'Ошибка Яндекс.Карт:',
            err,
          );

          if (!cancelled) {
            setError(
              err instanceof Error
                ? err.message
                : 'Не удалось загрузить карту',
            );
          }
        }
      };

    void initMap();

    return () => {
      cancelled = true;

      if (mapRef.current) {
        mapRef.current.destroy();

        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        ref={mapContainerRef}
        className={styles.map}
      />

      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <span
            className={`${styles.legendColor} ${styles.legendBlue}`}
          />

          <span>
            Основная зона
          </span>
        </div>

        <div className={styles.legendRow}>
          <span
            className={`${styles.legendColor} ${styles.legendYellow}`}
          />

          <span>
            По договорённости
          </span>
        </div>

        <div className={styles.legendRow}>
          <span
            className={`${styles.legendColor} ${styles.legendRed}`}
          />

          <span>
            Не обслуживаем
          </span>
        </div>
      </div>

      <div className={styles.note}>
        Основная зона — север
        Санкт-Петербурга и ближайшие
        направления Ленинградской области.
        Дальние северные адреса
        согласовываются отдельно.
      </div>

      {error && (
        <div className={styles.error}>
          <strong>
            Не удалось загрузить карту
          </strong>

          <span>
            {error}
          </span>

          <small>
            Проверьте API-ключ Яндекс.Карт
            и разрешённый домен.
          </small>
        </div>
      )}
    </div>
  );
}
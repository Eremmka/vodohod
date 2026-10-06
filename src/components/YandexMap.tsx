'use client';

import Script from 'next/script';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './YandexMap.module.scss';

const API_KEY =
  process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';

type Coordinates = [number, number];

interface YandexMapInstance {
  destroy(): void;

  geoObjects: {
    add(object: unknown): void;
  };

  controls: {
    add(control: unknown): void;
  };
}

interface YandexMaps {
  ready: (
    successCallback: () => void,
    errorCallback?: (error: unknown) => void,
  ) => unknown;

  Map: new (
    element: HTMLElement,
    state: {
      center: Coordinates;
      zoom: number;
      type?: string;
      controls?: string[];
    },
  ) => YandexMapInstance;

  Polygon: new (
    geometry: Coordinates[][],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => unknown;

  control: {
    ZoomControl: new (
      options?: Record<string, unknown>,
    ) => unknown;

    FullscreenControl: new (
      options?: Record<string, unknown>,
    ) => unknown;
  };
}

declare global {
  interface Window {
    ymaps?: YandexMaps;
  }
}

/*
 * =========================================================
 * НАСТРОЙКИ КАРТЫ
 * =========================================================
 */

const MAP_CENTER: Coordinates = [
  30.34,
  60.12,
];

const MAP_ZOOM = 9.75;


/*
 * =========================================================
 * ОСНОВНАЯ ЗОНА
 * =========================================================
 */

const MAIN_ZONE: Coordinates[] = [
  /*
   * Белоостров / северо-запад.
   */
  [29.97, 60.16],
  [29.99, 60.21],
  [30.05, 60.26],

  /*
   * Елизаветинка / север.
   */
  [30.14, 60.31],
  [30.28, 60.34],
  [30.43, 60.35],

  /*
   * Северная часть.
   */
  [30.54, 60.35],
  [30.61, 60.33],

  /*
   * Правая граница.
   */
  [30.57, 60.15],
  [30.51, 60.10],
  [30.51, 60.05],

  /*
   * Восточная нижняя часть.
   */
  [30.51, 60.05],
  [30.47, 60.03],

  /*
   * Южная граница.
   */
  [30.46, 60.03],
  [30.38, 60.04],
  [30.30, 60.05],
  [30.22, 60.06],

  /*
   * Западная часть.
   */
  [30.15, 60.08],
  [30.08, 60.10],
  [30.03, 60.13],

  /*
   * Возвращаемся к Белоострову.
   */
  [29.97, 60.16],
];


/*
 * =========================================================
 * ЗОНА ПО ДОГОВОРЁННОСТИ
 * =========================================================
 *
 * Немного поднята севернее.
 *
 * Здесь:
 *
 * - Пионерская;
 * - Пискарёвка;
 * - Площадь Мужества;
 * - Белоостров;
 * - более дальние северные адреса.
 */

const AGREEMENT_ZONE: Coordinates[] = [
  /*
   * Западная часть.
   *
   * Границу у Сестрорецка выровняли,
   * чтобы она шла плавнее без резкого
   * выступа влево.
   */
  [29.96, 60.08],
  [29.93, 60.13],
  [29.92, 60.18],
  [29.93, 60.23],
  [29.96, 60.27],

  /*
   * Северо-запад.
   */
  [30.00, 60.31],
  [30.10, 60.36],
  [30.23, 60.39],

  /*
   * Верхняя граница.
   */
  [30.40, 60.40],
  [30.54, 60.40],
  [30.64, 60.38],

  /*
   * Правая верхняя часть.
   */
  [30.64, 60.34],
  [30.60, 60.29],
  [30.60, 60.23],

  /*
   * Правая сторона.
   */
  [30.55, 60.15],
  [30.51, 60.10],
  [30.51, 60.05],

  /*
   * Южная часть.
   */
  [30.46, 60.01],
  [30.40, 59.99],
  [30.31, 60.00],
  [30.22, 60.01],

  /*
   * Нижняя западная часть.
   */
  [30.13, 60.03],
  [30.05, 60.05],
  [29.99, 60.06],
  [29.96, 60.07],

  /*
   * Замыкаем.
   */
  [29.96, 60.08],
];


/*
 * =========================================================
 * ГОТОВНОСТЬ YANDEX API
 * =========================================================
 */

function waitForYandexReady(
  ymaps: YandexMaps,
): Promise<void> {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      ymaps.ready(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        },
      );
    },
  );
}


/*
 * =========================================================
 * КОМПОНЕНТ КАРТЫ
 * =========================================================
 */

export default function YandexMap() {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<YandexMapInstance | null>(
      null,
    );

  const initializedRef =
    useRef(false);

  const [
    scriptLoaded,
    setScriptLoaded,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );


  /*
   * =======================================================
   * ИНИЦИАЛИЗАЦИЯ КАРТЫ
   * =======================================================
   */

  useEffect(() => {
    if (!scriptLoaded) {
      return;
    }

    if (
      initializedRef.current
    ) {
      return;
    }

    /*
     * Получаем ymaps локально,
     * чтобы TypeScript точно знал,
     * что объект существует.
     */
    const ymaps =
      window.ymaps;

    if (!ymaps) {
      setError(
        'Объект ymaps не найден',
      );

      return;
    }

    const container =
      mapContainerRef.current;

    if (!container) {
      setError(
        'Контейнер карты не найден',
      );

      return;
    }

    let destroyed = false;


    const initMap =
      async () => {
        try {
          setError(null);

          /*
           * Ждём полной готовности API.
           */
          await waitForYandexReady(
            ymaps,
          );

          if (
            destroyed
          ) {
            return;
          }


          /*
           * =================================================
           * КАРТА
           * =================================================
           */

          const map =
            new ymaps.Map(
              container,
              {
                center:
                  MAP_CENTER,

                zoom:
                  MAP_ZOOM,

                type:
                  'yandex#map',

                controls: [],
              },
            );

          mapRef.current =
            map;


          /*
           * =================================================
           * ЖЁЛТАЯ ЗОНА
           * =================================================
           */

          const agreementPolygon =
            new ymaps.Polygon(
              [
                AGREEMENT_ZONE,
              ],

              {
                hintContent:
                  'Доставка по договорённости',
              },

              {
                fillColor:
                  'FFD35C26',

                strokeColor:
                  'E8A400',

                strokeWidth:
                  4,

                strokeOpacity:
                  0.72,

                fillOpacity:
                  0.10,
              },
            );

          map.geoObjects.add(
            agreementPolygon,
          );


          /*
           * =================================================
           * СИНЯЯ ЗОНА
           * =================================================
           */

          const mainPolygon =
            new ymaps.Polygon(
              [
                MAIN_ZONE,
              ],

              {
                hintContent:
                  'Основная зона доставки',
              },

              {
                fillColor:
                  '1598EE2B',

                strokeColor:
                  '1598EE',

                strokeWidth:
                  5,

                strokeOpacity:
                  0.75,

                fillOpacity:
                  0.14,
              },
            );

          map.geoObjects.add(
            mainPolygon );


          /*
           * =================================================
           * ZOOM CONTROL
           * =================================================
           */

          const zoomControl =
            new ymaps.control.ZoomControl(
              {
                options: {
                  size:
                    'small',
                },
              },
            );

          map.controls.add(
            zoomControl,
          );


          /*
           * =================================================
           * FULLSCREEN
           * =================================================
           */

          const fullscreenControl =
            new ymaps.control.FullscreenControl();

          map.controls.add(
            fullscreenControl,
          );

          initializedRef.current =
            true;
        } catch (
          err
        ) {
          console.error(
            'Ошибка Яндекс.Карт:',
            err,
          );

          if (
            !destroyed
          ) {
            setError(
              err instanceof Error &&
              err.message
                ? err.message
                : 'Не удалось создать карту',
            );
          }
        }
      };


    void initMap();


    return () => {
      destroyed = true;

      if (
        mapRef.current
      ) {
        mapRef.current.destroy();

        mapRef.current =
          null;
      }

      initializedRef.current =
        false;
    };
  }, [scriptLoaded]);


  /*
   * =======================================================
   * API-КЛЮЧ ОТСУТСТВУЕТ
   * =======================================================
   */

  if (!API_KEY) {
    return (
      <div
        className={
          styles.wrapper
        }
      >
        <div
          className={
            styles.error
          }
        >
          <strong>
            Не настроен API-ключ
          </strong>

          <span>
            Добавьте
            NEXT_PUBLIC_YANDEX_MAPS_API_KEY
            в .env.local.
          </span>
        </div>
      </div>
    );
  }


  /*
   * =======================================================
   * РЕНДЕР
   * =======================================================
   */

  return (
    <div
      className={
        styles.wrapper
      }
    >
      <Script
        id="yandex-maps-api-2-1"
        src={
          `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(
            API_KEY,
          )}&lang=ru_RU&coordorder=longlat`
        }
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(
            true,
          );
        }}
        onReady={() => {
          setScriptLoaded(
            true,
          );
        }}
        onError={() => {
          setError(
            'Не удалось загрузить API Яндекс.Карт',
          );
        }}
      />

      <div
        ref={
          mapContainerRef
        }
        className={
          styles.map
        }
      />


      {!scriptLoaded &&
        !error && (
          <div
            className={
              styles.loading
            }
          >
            Загрузка карты…
          </div>
        )}


     
      <div
        className={
          styles.legend
        }
      >
        <div
          className={
            styles.legendRow
          }
        >
          <span
            className={`${styles.legendColor} ${styles.legendBlue}`}
          />

          <span>
            Основная зона
          </span>
        </div>

        <div
          className={
            styles.legendRow
          }
        >
          <span
            className={`${styles.legendColor} ${styles.legendYellow}`}
          />

          <span>
            По договорённости
          </span>
        </div>
      </div>


      {error && (
        <div
          className={
            styles.error
          }
        >
          <strong>
            Не удалось загрузить карту
          </strong>

          <span>
            {error}
          </span>

          <small>
            Проверьте API-ключ
            Яндекс.Карт и разрешённый
            домен.
          </small>
        </div>
      )}
    </div>
  );
}
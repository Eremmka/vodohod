'use client';

import { useState } from 'react';
import styles from './VodokhodLanding.module.scss';
import TruckIllustration from './TruckIllustration';
import YandexMap from './YandexMap';

import {
  ArrowIcon,
  CheckIcon,
  CloseIcon,
  DropletIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  StarIcon,
  TelegramIcon,
  TruckIcon,
} from './icons';

const TELEGRAM_USERNAME = 'eremkkaaa';

const PHONE = '8 901 309 38 09';
const PHONE_HREF = '+79013093809';

const FORM_ENDPOINT =
  'https://formspree.io/f/xljgeenk';

const AVITO_URL =
  'https://www.avito.ru/sankt-peterburg/predlozheniya_uslug/dostavka_vody_vodovoz_449558415';

const ASSET_PREFIX =
  process.env.NEXT_PUBLIC_BASE_PATH || '';

const telegramUrl =
  `https://t.me/${TELEGRAM_USERNAME}`;

const services = [
  [
    'Для частных домов',
    'Дача, дом, ёмкость, хозяйственные нужды',
  ],
  [
    'Для бассейнов',
    'Наполнение, долив и сезонная подготовка',
  ],
  [
    'Для строительства',
    'Стройплощадки, бетон, пыль, технические задачи',
  ],
  [
    'Для предприятий',
    'Производство, склады, территории и объекты',
  ],
  [
    'Для сельского хозяйства',
    'Полив, хозяйственные и сезонные задачи',
  ],
  [
    'Для мероприятий',
    'Площадки, выездные события и фестивали',
  ],
  [
    'Для пожарных нужд',
    'Резервный запас воды по договорённости',
  ],
  [
    'И многое другое',
    'Скажите, что нужно решить — подберём вариант',
  ],
];

const advantages = [
  [
    'С 2009 года',
    'опыт работы',
    'Работаем с клиентами много лет и знаем специфику доставки.',
  ],
  [
    '8 м³',
    'объём цистерны',
    'Большой объём за один рейс без лишних поездок.',
  ],
  [
    'Свой',
    'водовоз',
    'Без посредников: владелец лично принимает заказ и сам приезжает.',
  ],
  [
    'Гибкие',
    'условия',
    'Стоимость и время доставки согласовываем под конкретный адрес.',
  ],
  [
    'Срочно',
    'по договорённости',
    'Можем оперативно приехать, если есть возможность по маршруту.',
  ],
];

const faq = [
  [
    'Какой объём воды можно заказать?',
    'Объём цистерны — 8 м³. Точный объём и формат доставки согласовываем при заказе.',
  ],
  [
    'Сколько стоит доставка?',
    'Фиксированной цены нет: стоимость зависит прежде всего от адреса и расстояния. Оставьте заявку — рассчитаем стоимость.',
  ],
  [
    'Можно ли заказать срочную доставку?',
    'Да. Срочная подача возможна по договорённости и зависит от текущей загрузки и маршрута.',
  ],
  [
    'Можно ли заказать воду для бассейна?',
    'Да. Привезём воду и организуем подачу на участок в согласованное время.',
  ],
  [
    'В какие районы вы приезжаете?',
    'Основная зона — север Санкт-Петербурга и ближайшие направления Ленинградской области. Более дальние северные адреса согласовываем отдельно.',
  ],
  [
    'Какая вода доставляется?',
    'Вода используется для любых согласованных задач: бытовых, технических, строительных, хозяйственных и других.',
  ],
];

const gallery = [
  {
    title: 'Заполнение бассейна',
    image: `${ASSET_PREFIX}/images/work-01.svg`,
  },
  {
    title: 'Наполнение ёмкости',
    image: `${ASSET_PREFIX}/images/work-02.svg`,
  },
  {
    title: 'Строительная площадка',
    image: `${ASSET_PREFIX}/images/work-03.svg`,
  },
  {
    title: 'Мероприятие',
    image: `${ASSET_PREFIX}/images/work-04.svg`,
  },
  {
    title: 'Полив участка',
    image: `${ASSET_PREFIX}/images/work-05.svg`,
  },
];

const reviews = [
  {
    name: 'Екатерина',
    meta: '3 июля • Авито • Сделка состоялась',
    text: 'Заказываем воду не первый раз. Очень удобно, что Иван всегда на связи, всё можно быстро обсудить и договориться. На сложном объекте всё получилось организовать без проблем.',
  },
  {
    name: 'Николай',
    meta: '2 июля • Авито • Сделка состоялась',
    text: 'Заказывали 5 м³ воды для бассейна. Приехали вовремя, как договаривались. Цена не изменилась, всё чётко.',
  },
  {
    name: 'Татьяна Таску',
    meta: '20 мая • Авито • Сделка состоялась',
    text: 'Уже обращались не первый раз для бассейна. В очередной раз всё вовремя, без лишней суеты. Когда понадобилось больше воды, всё быстро организовали.',
  },
  {
    name: 'Дмитрий Сергеев',
    meta: '28 июля 2025 • Авито • Сделка состоялась',
    text: 'Нужно было срочно привезти воду. Договорились и примерно через два часа вода уже была на месте. Очень выручили.',
  },
  {
    name: 'Валентина',
    meta: '28 июня • Авито • Сделка состоялась',
    text: 'Вода приехала примерно через полтора часа после заказа. Всё отлично, будем обращаться ещё.',
  },
  {
    name: 'Ксения',
    meta: '30 июля 2025 • Авито • Сделка состоялась',
    text: 'Нужно было в этот же день полить участок. Иван помог с вопросом по гидранту и организовал доставку. Остались довольны.',
  },
];

export default function VodokhodLanding() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [openFaq, setOpenFaq] =
    useState<number | null>(0);

  const [lightbox, setLightbox] =
    useState<number | null>(null);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main>
      {/* HEADER */}

      <header className={styles.header}>
        <div className="container">
          <div className={styles.navbar}>
            <a
              className={styles.logo}
              href="#top"
              aria-label="ВодоХод — на главную"
              onClick={closeMenu}
            >
              <span className={styles.logoMark}>
                <DropletIcon size={30} />
              </span>

              <span>
                <strong>ВодоХод</strong>
                <small>
                  доставка воды на объект
                </small>
              </span>
            </a>

            <nav
              className={`${styles.nav} ${
                menuOpen
                  ? styles.navOpen
                  : ''
              }`}
            >
              {[
                ['Услуги', '#services'],
                [
                  'Преимущества',
                  '#advantages',
                ],
                [
                  'Как мы работаем',
                  '#how',
                ],
                [
                  'Зона работы',
                  '#area',
                ],
                ['Фото', '#gallery'],
                [
                  'Отзывы',
                  '#reviews',
                ],
                ['FAQ', '#faq'],
              ].map(
                ([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={closeMenu}
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>

            <div
              className={
                styles.headerActions
              }
            >
              <a
                className={styles.phone}
                href={`tel:${PHONE_HREF}`}
              >
                <span>
                  <PhoneIcon size={17} />
                </span>

                <b>{PHONE}</b>
              </a>

              <a
                className="btn btn--primary"
                href="#order"
              >
                Заказать водовоз
                <ArrowIcon />
              </a>

              <button
                className={
                  styles.menuButton
                }
                onClick={() =>
                  setMenuOpen(
                    (value) =>
                      !value,
                  )
                }
                aria-label="Открыть меню"
                type="button"
              >
                {menuOpen ? (
                  <CloseIcon />
                ) : (
                  <MenuIcon />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section
        className={styles.hero}
        id="top"
      >
        <div
          className={
            styles.heroGlow
          }
        />

        <div className="container">
          <div
            className={
              styles.heroGrid
            }
          >
            <div
              className={
                styles.heroCopy
              }
            >
              <span
                className={
                  styles.pill
                }
              >
                <DropletIcon size={16} />
                Доставка воды для любых
                нужд
              </span>

              <h1>
                Вода на объект —
                <span>
                  сегодня
                </span>
              </h1>

              <p
                className={
                  styles.heroLead
                }
              >
                Водовоз «ВодоХод» с
                цистерной 8 м³.
                Работаем по северу
                Санкт-Петербурга и
                Ленинградской области —
                быстро, надёжно и под
                вашу задачу.
              </p>

              <div
                className={
                  styles.heroButtons
                }
              >
                <a
                  className="btn btn--primary"
                  href="#order"
                >
                  Узнать стоимость
                  <ArrowIcon />
                </a>

                <a
                  className="btn btn--ghost"
                  href={`tel:${PHONE_HREF}`}
                >
                  <PhoneIcon size={18} />
                  Позвонить
                </a>
              </div>

              <div
                className={
                  styles.microProofs
                }
              >
                <span>
                  <CheckIcon />
                  Работаем с 2009 года
                </span>

                <span>
                  <CheckIcon />
                  8 м³ за рейс
                </span>

                <span>
                  <CheckIcon />
                  Санкт-Петербург +
                  Ленобласть
                </span>
              </div>
            </div>

            <TruckIllustration />
          </div>

          <div
            className={
              styles.heroStats
            }
          >
            <div>
              <strong>
                2009
              </strong>

              <span>
                работаем с
              </span>
            </div>

            <div>
              <strong>
                8 м³
              </strong>

              <span>
                объём цистерны
              </span>
            </div>

            <div>
              <strong>
                Север
              </strong>

              <span>
                Санкт-Петербурга
              </span>
            </div>

            <div>
              <strong>
                Любые
              </strong>

              <span>
                согласованные задачи
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}

      <section
        className="section"
        id="services"
      >
        <div className="container">
          <span className="eyebrow">
            Наши услуги
          </span>

          <h2 className="h2">
            Доставка воды для любых задач
          </h2>

          <p className="section-lead">
            Неважно, бассейн у вас,
            стройка, производство или
            частный дом. Расскажите, что
            нужно решить — подберём
            подходящий вариант доставки.
          </p>

          <div
            className={
              styles.servicesGrid
            }
          >
            {services.map(
              (
                [title, text],
                index,
              ) => (
                <article
                  className={
                    styles.serviceCard
                  }
                  key={title}
                >
                  <span
                    className={
                      styles.serviceIcon
                    }
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
                  </span>

                  <div>
                    <h3>
                      {title}
                    </h3>

                    <p>
                      {text}
                    </p>
                  </div>
                </article>
              ),
            )}

            <div
              className={
                styles.serviceImagePlaceholder
              }
              aria-hidden="true"
            >
              <div
                className={
                  styles.waterRipple
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}

      <section
        className={`${styles.softSection} section`}
        id="advantages"
      >
        <div className="container">
          <span className="eyebrow">
            Почему выбирают нас
          </span>

          <h2 className="h2">
            Выгодно клиенту. Понятно с
            первого звонка.
          </h2>

          <div
            className={
              styles.advantagesGrid
            }
          >
            {advantages.map(
              (
                [
                  big,
                  title,
                  text,
                ],
              ) => (
                <article
                  key={title}
                  className={
                    styles.advantageCard
                  }
                >
                  <span
                    className={
                      styles.advantageIcon
                    }
                  >
                    <DropletIcon
                      size={23}
                    />
                  </span>

                  <strong>
                    {big}
                  </strong>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {text}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}

      <section
        className="section"
        id="how"
      >
        <div className="container">
          <span className="eyebrow">
            Как мы работаем
          </span>

          <h2 className="h2">
            Простой процесс заказа
          </h2>

          <div
            className={
              styles.stepsGrid
            }
          >
            {[
              [
                '01',
                'Оставляете заявку',
                'Через форму на сайте, по телефону или в Telegram.',
              ],
              [
                '02',
                'Уточняем детали',
                'Объём, адрес, удобное время и особенности объекта.',
              ],
              [
                '03',
                'Доставляем воду',
                'Приезжаем в согласованное время на ваш объект.',
              ],
              [
                '04',
                'Вы получаете воду',
                'Подача воды под нужную вам задачу.',
              ],
            ].map(
              (
                [
                  num,
                  title,
                  text,
                ],
              ) => (
                <div
                  className={
                    styles.step
                  }
                  key={num}
                >
                  <span>
                    {num}
                  </span>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {text}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* AREA */}

      <section
        className={`${styles.areaSection} section`}
        id="area"
      >
        <div className="container">
          <div
            className={
              styles.areaGrid
            }
          >
            <div>
              <span className="eyebrow">
                Зона работы
              </span>

              <h2 className="h2">
                Где мы работаем
              </h2>

              <p className="section-lead">
                Основная зона доставки —
                север Санкт-Петербурга и
                ближайшие направления
                Ленинградской области.
                Севернее основной зоны также
                можем приехать по
                договорённости.
              </p>

              <div
                className={
                  styles.areaList
                }
              >
                <div>
                  <MapPinIcon size={20} />

                  <span>
                    Кондратьевский
                    проспект, Пискарёвка,
                    Площадь Мужества,
                    Ручьи и Пионерская
                  </span>
                </div>

                <div>
                  <MapPinIcon size={20} />

                  <span>
                    Елизаветинка,
                    Лесколово,
                    Новое Токсово и
                    Токсово
                  </span>
                </div>

                <div>
                  <MapPinIcon size={20} />

                  <span>
                    Белоостров и севернее
                    — по договорённости
                  </span>
                </div>

                <div>
                  <TruckIcon size={20} />

                  <span>
                    Всеволожск —
                    не обслуживаем
                  </span>
                </div>
              </div>

              <a
                className="btn btn--primary"
                href="#order"
              >
                Проверить ваш адрес
                <ArrowIcon />
              </a>
            </div>

            <div
              className={
                styles.mapWrap
              }
            >
              <YandexMap />
            </div>
          </div>
        </div>
      </section>

      {/* TRUCK */}

      <section className="section">
        <div className="container">
          <span className="eyebrow">
            Наш водовоз
          </span>

          <h2 className="h2">
            8 м³ воды за один рейс
          </h2>

          <div
            className={
              styles.specGrid
            }
          >
            <div
              className={
                styles.specVisual
              }
            >
              <TruckIllustration />
            </div>

            <div
              className={
                styles.specList
              }
            >
              {[
                [
                  'Объём цистерны',
                  '8 м³',
                ],
                [
                  'Назначение',
                  'Для согласованных бытовых и технических задач',
                ],
                [
                  'Подача',
                  'Насос, шланг и разводка — по задаче',
                ],
                [
                  'Режим работы',
                  'Плановая и срочная доставка по договорённости',
                ],
              ].map(
                (
                  [label, value],
                ) => (
                  <div
                    className={
                      styles.specRow
                    }
                    key={label}
                  >
                    <span>
                      <CheckIcon
                        size={18}
                      />
                    </span>

                    <b>
                      {label}
                    </b>

                    <em>
                      {value}
                    </em>
                  </div>
                ),
              )}

              <div
                className={
                  styles.specNote
                }
              >
                * Финальные условия,
                стоимость и время подачи
                согласовываются до выезда.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}

      <section
        className={`${styles.softSection} section`}
        id="gallery"
      >
        <div className="container">
          <span className="eyebrow">
            Фото с работ
          </span>

          <h2 className="h2">
            Как выглядит доставка вживую
          </h2>

          <p className="section-lead">
            Примеры задач, для которых мы
            доставляем воду по
            Санкт-Петербургу и
            Ленинградской области.
          </p>

          <div
            className={
              styles.galleryGrid
            }
          >
            {gallery.map(
              (
                item,
                index,
              ) => (
                <button
                  className={`${styles.galleryCard} ${
                    index === 0
                      ? styles.galleryCardLarge
                      : ''
                  }`}
                  key={item.title}
                  onClick={() =>
                    setLightbox(
                      index,
                    )
                  }
                  type="button"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <span>
                    {item.title}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS */}

      <section
        className="section"
        id="reviews"
      >
        <div className="container">
          <span className="eyebrow">
            Отзывы
          </span>

          <h2 className="h2">
            Нам доверяют
          </h2>

          <div
            className={
              styles.reviewsGrid
            }
          >
            {reviews.map(
              (review) => (
                <article
                  className={
                    styles.reviewCard
                  }
                  key={review.name}
                >
                  <div
                    className={
                      styles.avatar
                    }
                  >
                    {review.name
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>

                  <div
                    className={
                      styles.reviewBody
                    }
                  >
                    <div
                      className={
                        styles.reviewTop
                      }
                    >
                      <strong>
                        {review.name}
                      </strong>

                      <span>
                        {review.meta}
                      </span>
                    </div>

                    <div
                      className={
                        styles.stars
                      }
                      aria-label="5 из 5"
                    >
                      {[
                        1,
                        2,
                        3,
                        4,
                        5,
                      ].map(
                        (star) => (
                          <StarIcon
                            key={
                              star
                            }
                          />
                        ),
                      )}
                    </div>

                    <p>
                      “{review.text}”
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section
        className={`${styles.softSection} section`}
        id="faq"
      >
        <div className="container">
          <span className="eyebrow">
            Вопросы и ответы
          </span>

          <h2 className="h2">
            Часто задаваемые вопросы
          </h2>

          <div
            className={
              styles.faqGrid
            }
          >
            <div>
              {faq.map(
                (
                  [
                    question,
                    answer,
                  ],
                  index,
                ) => (
                  <div
                    className={
                      styles.faqItem
                    }
                    key={question}
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(
                          openFaq ===
                            index
                            ? null
                            : index,
                        )
                      }
                      aria-expanded={
                        openFaq ===
                        index
                      }
                      type="button"
                    >
                      <span>
                        {question}
                      </span>

                      <span
                        className={
                          styles.faqPlus
                        }
                      >
                        {openFaq ===
                        index
                          ? '−'
                          : '+'}
                      </span>
                    </button>

                    {openFaq ===
                      index && (
                      <p>
                        {answer}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>

            <aside
              className={
                styles.telegramCard
              }
            >
              <span
                className={
                  styles.telegramIcon
                }
              >
                <TelegramIcon
                  size={26}
                />
              </span>

              <h3>
                Остались вопросы?
              </h3>

              <p>
                Напишите нам в
                Telegram — отвечаем и
                согласуем доставку.
              </p>

              <a
                className="btn btn--white"
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
              >
                Написать в Telegram
                <ArrowIcon />
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ORDER */}

      <section
        className={
          styles.orderSection
        }
        id="order"
      >
        <div className="container">
          <div
            className={
              styles.orderGrid
            }
          >
            <div
              className={
                styles.orderCopy
              }
            >
              <span
                className={
                  styles.orderEyebrow
                }
              >
                Оставьте заявку
              </span>

              <h2>
                Рассчитать стоимость
                доставки
              </h2>

              <p>
                Заполните форму, и мы
                свяжемся с вами,
                уточним детали и
                рассчитаем стоимость
                под вашу задачу.
              </p>

              <div
                className={
                  styles.orderChecks
                }
              >
                <span>
                  <CheckIcon />
                  Бесплатный расчёт
                </span>

                <span>
                  <CheckIcon />
                  Индивидуальный расчёт
                </span>

                <span>
                  <CheckIcon />
                  Без посредников
                </span>
              </div>

              <div
                className={
                  styles.orderContact
                }
              >
                <span>
                  Телефон
                </span>

                <a
                  href={`tel:${PHONE_HREF}`}
                >
                  {PHONE}
                </a>

                <span>
                  Telegram
                </span>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  @
                  {
                    TELEGRAM_USERNAME
                  }
                </a>

                <span>
                  Avito
                </span>

                <a
                  href={AVITO_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Объявление на Avito
                </a>
              </div>
            </div>

            <form
              className={
                styles.form
              }
              action={FORM_ENDPOINT}
              method="POST"
              acceptCharset="UTF-8"
            >
              <div
                className={
                  styles.formGrid
                }
              >
                <label>
                  <span>
                    Как вас зовут
                  </span>

                  <input
                    name="name"
                    placeholder="Иван"
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  <span>
                    Телефон
                  </span>

                  <input
                    name="phone"
                    placeholder="8 900 000-00-00"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                  />
                </label>

                <label
                  className={
                    styles.formFull
                  }
                >
                  <span>
                    Адрес доставки
                  </span>

                  <input
                    name="address"
                    placeholder="Например: Санкт-Петербург, ул. ..."
                    autoComplete="street-address"
                    required
                  />
                </label>

                <label>
                  <span>
                    Объём воды
                  </span>

                  <select
                    name="volume"
                    defaultValue="8 м³"
                  >
                    <option>
                      8 м³
                    </option>

                    <option>
                      4 м³
                    </option>

                    <option>
                      Другой объём
                    </option>
                  </select>
                </label>

                <label>
                  <span>
                    Желаемая дата
                  </span>

                  <input
                    name="date"
                    type="date"
                  />
                </label>

                <label
                  className={
                    styles.formFull
                  }
                >
                  <span>
                    Что нужно решить?
                  </span>

                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Бассейн, ёмкость, стройка, полив и т.д."
                  />
                </label>
              </div>

              <input
                type="hidden"
                name="_subject"
                value="Новая заявка — ВодоХод"
              />

              <input
                type="hidden"
                name="source"
                value="Сайт ВодоХод"
              />

              <input
                className={
                  styles.formHoneypot
                }
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <button
                className="btn btn--primary"
                type="submit"
              >
                Отправить заявку
                <ArrowIcon />
              </button>

              <small
                className={
                  styles.formConsent
                }
              >
                Нажимая кнопку, вы
                соглашаетесь на обработку
                указанных данных для связи
                по заявке.
              </small>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer
        className={
          styles.footer
        }
      >
        <div className="container">
          <div
            className={
              styles.footerTop
            }
          >
            <a
              className={
                styles.logo
              }
              href="#top"
            >
              <span
                className={
                  styles.logoMark
                }
              >
                <DropletIcon
                  size={30}
                />
              </span>

              <span>
                <strong>
                  ВодоХод
                </strong>

                <small>
                  доставка воды на
                  объект
                </small>
              </span>
            </a>

            <nav>
              {[
                [
                  'Услуги',
                  '#services',
                ],
                [
                  'Преимущества',
                  '#advantages',
                ],
                [
                  'Как работаем',
                  '#how',
                ],
                [
                  'Зона работы',
                  '#area',
                ],
                [
                  'Фото',
                  '#gallery',
                ],
                [
                  'Отзывы',
                  '#reviews',
                ],
                [
                  'FAQ',
                  '#faq',
                ],
              ].map(
                (
                  [label, href],
                ) => (
                  <a
                    key={href}
                    href={href}
                  >
                    {label}
                  </a>
                ),
              )}
            </nav>

            <a
              href={`tel:${PHONE_HREF}`}
              className={
                styles.footerPhone
              }
            >
              <PhoneIcon
                size={17}
              />

              {PHONE}
            </a>

            <a
              href={AVITO_URL}
              target="_blank"
              rel="noreferrer"
              className={
                styles.avitoButton
              }
              aria-label="Открыть объявление ВодоХод на Avito"
            >
              A
            </a>
          </div>

          <div
            className={
              styles.footerBottom
            }
          >
            <span>
              © 2026 ВодоХод. Доставка
              воды на объект.
            </span>

            <span>
              Санкт-Петербург и
              Ленинградская область
            </span>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTIONS */}

      <div
        className={
          styles.floatingActions
        }
      >
        <a
          href={`tel:${PHONE_HREF}`}
          aria-label="Позвонить"
        >
          <PhoneIcon size={19} />
        </a>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
        >
          <TelegramIcon size={21} />
        </a>

        <a
          href={AVITO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Avito"
          className={
            styles.avitoButton
          }
        >
          A
        </a>
      </div>

      {/* LIGHTBOX */}

      {lightbox !== null && (
        <div
          className={
            styles.lightbox
          }
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фотографии"
          onClick={() =>
            setLightbox(null)
          }
        >
          <button
            className={
              styles.lightboxClose
            }
            onClick={() =>
              setLightbox(null)
            }
            aria-label="Закрыть"
            type="button"
          >
            <CloseIcon />
          </button>

          <img
            src={
              gallery[lightbox]
                .image
            }
            alt={
              gallery[lightbox]
                .title
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          />

          <strong>
            {
              gallery[lightbox]
                .title
            }
          </strong>
        </div>
      )}
    </main>
  );
}
'use client';

import { FormEvent, useMemo, useState } from 'react';
import styles from './VodokhodLanding.module.scss';
import TruckIllustration from './TruckIllustration';

import {
  ArrowIcon,
  CheckIcon,
  CloseIcon,
  DropletIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  TelegramIcon,
  TruckIcon,
} from './icons';

const TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'eremkkaa';

const PHONE = '8 901 309 38 09';
const PHONE_HREF = '+79013093809';

const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || '';

const FORM_ENDPOINT = FORMSPREE_ID
  ? `https://formspree.io/f/${FORMSPREE_ID}`
  : '';

const ASSET_PREFIX =
  process.env.NEXT_PUBLIC_BASE_PATH || '';

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
    'Скажите, что нужно решить — подберем вариант',
  ],
];

const advantages = [
  [
    '2009',
    'работаем с этого года',
    'Более 15 лет занимаемся доставкой воды и знаем специфику работы по региону.',
  ],
  [
    'Лично',
    'владелец',
    'С вами напрямую работает Иван — он принимает заказ и сам приезжает на объект.',
  ],
  [
    'Без',
    'посредников',
    'Вы договариваетесь непосредственно с владельцем — без диспетчеров и лишних звеньев.',
  ],
  [
    '8 м³',
    'за рейс',
    'Объём цистерны — до 8 м³. Подходит для частных и крупных задач.',
  ],
  [
    'Оперативно',
    'по договорённости',
    'Согласовываем удобное время и стараемся решить задачу максимально быстро.',
  ],
];

const faq = [
  [
    'Какой минимальный объём заказа?',
    'Базовый объём — полный рейс до 8 м³. Точный объём и формат доставки согласовываем по телефону.',
  ],
  [
    'Сколько стоит доставка?',
    'Цена зависит от объёма, адреса и срочности. Оставьте заявку — рассчитаем стоимость под ваш объект.',
  ],
  [
    'Можно ли заказать срочную доставку?',
    'Да, срочная подача возможна по договорённости и зависит от загрузки маршрута.',
  ],
  [
    'Можно ли заказать воду для бассейна?',
    'Да. Привезём воду и организуем подачу на участок в согласованное время.',
  ],
  [
    'В какие районы вы приезжаете?',
    'Работаем по северу Санкт-Петербурга и Ленинградской области. Дальние адреса обсуждаются отдельно.',
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
  [
    'Екатерина',
    '3 июля',
    'Спасибо большое. Уже не первый год пользуюсь услугами Ивана. Очень вежливый, терпеливый. Привозит воды даже чуть больше, чем заявлено. Всегда можно с ним договориться. У нас очень сложный участок. Он единственный, кто работает сверх честно и порядочно. Так что однозначно советую.',
  ],
  [
    'Николай',
    '2 июля',
    'Договорились о доставке 5 кубометров воды, требовалось заполнить часть бассейна. Оговорили сумму и время доставки. Ивану огромное спасибо за оперативное решение вопроса, всё доставлено в оговоренное время и стоимость не менялась. Могу рекомендовать!',
  ],
  [
    'Татьяна Таску',
    '20 мая',
    'Не первый раз уже обращаюсь к Ивану по вопросу доставки воды для бассейна. Всё как всегда на высшем уровне! Воду доставили вовремя как и договаривались, цена как и было оговорено, воды налили даже больше, чем было заказано.',
  ],
  [
    'Дмитрий Сергеев',
    '28 июля 2025',
    'Привёз воду через два часа после обращения, как обещал. Твёрдые пять звёзд, ответственный конкретный мужик.',
  ],
  [
    'Валентина',
    '28 июня',
    'Позвонила, договорились о цене, месте и времени. Спасибо большое Ивану за исполнительность — привез воду через 1,5 часа. Будем обращаться ещё.',
  ],
  [
    'Ксения',
    '30 июля 2025',
    'Списались с Иваном, договорились на доставку воды день в день для полива. Всё разлили быстро. Иван помог с гидрантом. Второй раз вызвали и разливали уже с мужем. Приятно было общаться.',
  ],
];

export default function VodokhodLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const [formStatus, setFormStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const telegramUrl = useMemo(
    () =>
      `https://t.me/${TELEGRAM_USERNAME.replace('@', '')}`,
    []
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!FORM_ENDPOINT) {
      setFormStatus('error');
      return;
    }

    const form = event.currentTarget;

    setFormStatus('submitting');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Formspree request failed');
      }

      form.reset();
      setFormStatus('success');

      window.setTimeout(() => {
        setFormStatus('idle');
      }, 6500);
    } catch {
      setFormStatus('error');
    }
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
            >
              <span className={styles.logoMark}>
                <DropletIcon size={30} />
              </span>

              <span>
                <strong>ВодоХод</strong>
                <small>доставка воды на объект</small>
              </span>
            </a>

            <nav
              className={`${styles.nav} ${
                menuOpen ? styles.navOpen : ''
              }`}
            >
              {[
                ['Услуги', '#services'],
                ['Преимущества', '#advantages'],
                ['Как мы работаем', '#how'],
                ['Зона работы', '#area'],
                ['Фото', '#gallery'],
                ['Отзывы', '#reviews'],
                ['FAQ', '#faq'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className={styles.headerActions}>
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
                className={styles.menuButton}
                onClick={() =>
                  setMenuOpen((value) => !value)
                }
                aria-label="Открыть меню"
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
        <div className={styles.heroGlow} />

        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.pill}>
                <DropletIcon size={16} />
                Доставка воды для любых нужд
              </span>

              <h1>
                Вода на объект —
                <span> сегодня</span>
              </h1>

              <p className={styles.heroLead}>
                Водовоз «ВодоХод» с цистерной 8 м³.
                Работаем по северу Санкт-Петербурга и
                Ленинградской области — быстро, надёжно
                и под вашу задачу.
              </p>

              <div className={styles.heroButtons}>
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

              <div className={styles.microProofs}>
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
                  Санкт-Петербург + Ленобласть
                </span>
              </div>
            </div>

            <TruckIllustration />
          </div>

          <div className={styles.heroStats}>
            <div>
              <strong>2009</strong>
              <span>работаем с этого года</span>
            </div>

            <div>
              <strong>8 м³</strong>
              <span>объём цистерны</span>
            </div>

            <div>
              <strong>Север</strong>
              <span>Санкт-Петербурга</span>
            </div>

            <div>
              <strong>Любые</strong>
              <span>согласованные задачи</span>
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
            Неважно, бассейн у вас, стройка,
            производство или частный дом.
            Расскажите, что нужно решить —
            подберём подходящий вариант доставки.
          </p>

          <div className={styles.servicesGrid}>
            {services.map(([title, text], index) => (
              <article
                className={styles.serviceCard}
                key={title}
              >
                <span
                  className={styles.serviceIcon}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}

            <div
              className={
                styles.serviceImagePlaceholder
              }
              aria-hidden="true"
            >
              <div
                className={styles.waterRipple}
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
            Почему нас выбирают
          </span>

          <h2 className="h2">
            Работаем с 2009 года
          </h2>

          <p className="section-lead">
            «ВодоХод» — это доставка воды без
            посредников. Владелец компании Иван лично
            принимает заказы и сам доставляет воду
            на объект.
          </p>

          <div className={styles.advantagesGrid}>
            {advantages.map(
              ([big, title, text]) => (
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
                    <DropletIcon size={23} />
                  </span>

                  <strong>{big}</strong>

                  <h3>{title}</h3>

                  <p>{text}</p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* HOW */}
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

          <div className={styles.stepsGrid}>
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
              ([num, title, text]) => (
                <div
                  className={styles.step}
                  key={num}
                >
                  <span>{num}</span>

                  <h3>{title}</h3>

                  <p>{text}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section
        className={`${styles.areaSection} section`}
        id="area"
      >
        <div className="container">
          <div className={styles.areaGrid}>
            <div>
              <span className="eyebrow">
                Зона работы
              </span>

              <h2 className="h2">
                Где мы работаем
              </h2>

              <p className="section-lead">
                Доставляем воду по северу
                Санкт-Петербурга и Ленинградской
                области.
              </p>

              <div className={styles.areaList}>
                <div>
                  <MapPinIcon size={20} />
                  <span>
                    Санкт-Петербург —
                    северные районы
                  </span>
                </div>

                <div>
                  <MapPinIcon size={20} />
                  <span>
                    Ленинградская область
                  </span>
                </div>

                <div>
                  <TruckIcon size={20} />
                  <span>
                    Дальние адреса —
                    по договорённости
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

            <div className={styles.mapWrap}>
              <iframe
                title="Карта зоны работы ВодоХод"
                src="https://www.openstreetmap.org/export/embed.html?bbox=29.65%2C59.88%2C31.6%2C60.25&layer=mapnik&marker=60.02%2C30.45"
                loading="lazy"
              />

              <div
                className={styles.mapBadge}
              >
                <span />
                Основная зона
                <br />
                <small>
                  Север СПб + Ленобласть
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">
            Наш водовоз
          </span>

          <h2 className="h2">
            8 м³ воды за один рейс
          </h2>

          <div className={styles.specGrid}>
            <div className={styles.specVisual}>
              <TruckIllustration />
            </div>

            <div className={styles.specList}>
              {[
                [
                  'Объём цистерны',
                  '8 м³',
                ],
                [
                  'Вид воды',
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
                ([label, value]) => (
                  <div
                    className={styles.specRow}
                    key={label}
                  >
                    <span>
                      <CheckIcon size={18} />
                    </span>

                    <b>{label}</b>

                    <em>{value}</em>
                  </div>
                )
              )}

              <div
                className={styles.specNote}
              >
                * Финальные условия, стоимость
                и время подачи согласовываются
                до выезда.
              </div>
            </div>
          </div>
        </div>
      </section>

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

          <div className={styles.galleryGrid}>
            {gallery.map((item, index) => (
              <button
                className={`${styles.galleryCard} ${
                  index === 0
                    ? styles.galleryCardLarge
                    : ''
                }`}
                key={item.title}
                onClick={() =>
                  setLightbox(index)
                }
              >
                <img
                  src={item.image}
                  alt={item.title}
                />

                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        id="reviews"
      >
        <div className="container">
          <span className="eyebrow">
            Отзывы клиентов
          </span>

          <h2 className="h2">
            Реальные отзывы с Авито
          </h2>

          <p className="section-lead">
            Клиенты отмечают оперативность,
            соблюдение договорённостей и качество
            доставки.
          </p>

          <div className={styles.reviewsGrid}>
            {reviews.map(
              ([name, date, text]) => (
                <article
                  className={styles.reviewCard}
                  key={`${name}-${date}`}
                >
                  <div className={styles.avatar}>
                    {name.slice(0, 1)}
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
                      <div
                        className={
                          styles.reviewAuthor
                        }
                      >
                        <strong>
                          {name}
                        </strong>

                        <span>{date}</span>
                      </div>

                      <small
                        className={
                          styles.reviewSource
                        }
                      >
                        Авито
                      </small>
                    </div>

                    <div
                      className={
                        styles.reviewMeta
                      }
                    >
                      Сделка состоялась
                    </div>

                    <p>«{text}»</p>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

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

          <div className={styles.faqGrid}>
            <div>
              {faq.map(
                ([question, answer], index) => (
                  <div
                    className={styles.faqItem}
                    key={question}
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(
                          openFaq === index
                            ? null
                            : index
                        )
                      }
                      aria-expanded={
                        openFaq === index
                      }
                    >
                      <span>{question}</span>

                      <span
                        className={
                          styles.faqPlus
                        }
                      >
                        {openFaq === index
                          ? '−'
                          : '+'}
                      </span>
                    </button>

                    {openFaq === index && (
                      <p>{answer}</p>
                    )}
                  </div>
                )
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
                <TelegramIcon size={26} />
              </span>

              <h3>
                Остались вопросы?
              </h3>

              <p>
                Напишите нам в Telegram —
                отвечаем и согласуем доставку.
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

      <section
        className={styles.orderSection}
        id="order"
      >
        <div className="container">
          <div className={styles.orderGrid}>
            <div
              className={styles.orderCopy}
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
                свяжемся с вами, уточним
                детали и рассчитаем стоимость
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
                  Без лишних звонков
                </span>
              </div>

              <div
                className={
                  styles.orderContact
                }
              >
                <span>Телефон</span>

                <a
                  href={`tel:${PHONE_HREF}`}
                >
                  {PHONE}
                </a>

                <span>Telegram</span>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  @
                  {TELEGRAM_USERNAME.replace(
                    '@',
                    ''
                  )}
                </a>
              </div>
            </div>

            <form
              className={styles.form}
              action={FORM_ENDPOINT || '#'}
              method="post"
              onSubmit={handleSubmit}
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
                    <option>8 м³</option>
                    <option>4 м³</option>
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

              <div
                className={
                  styles.formActions
                }
              >
                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={
                    formStatus ===
                    'submitting'
                  }
                >
                  {formStatus ===
                  'submitting'
                    ? 'Отправляем...'
                    : 'Отправить заявку'}

                  {formStatus !==
                    'submitting' && (
                    <ArrowIcon />
                  )}
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
              </div>

              {formStatus ===
                'success' && (
                <div
                  className={
                    styles.formSuccess
                  }
                >
                  Заявка отправлена. Мы
                  свяжемся с вами для
                  уточнения деталей.
                </div>
              )}

              {formStatus ===
                'error' && (
                <div
                  className={
                    styles.formHint
                  }
                >
                  Не удалось отправить
                  заявку. Попробуйте ещё
                  раз или напишите нам
                  в Telegram.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div
            className={
              styles.footerTop
            }
          >
            <a
              className={styles.logo}
              href="#top"
            >
              <span
                className={
                  styles.logoMark
                }
              >
                <DropletIcon size={30} />
              </span>

              <span>
                <strong>
                  ВодоХод
                </strong>

                <small>
                  доставка воды на объект
                </small>
              </span>
            </a>

            <nav>
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
                ['Отзывы', '#reviews'],
                ['FAQ', '#faq'],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                >
                  {label}
                </a>
              ))}
            </nav>

            <a
              href={`tel:${PHONE_HREF}`}
              className={
                styles.footerPhone
              }
            >
              <PhoneIcon size={17} />
              {PHONE}
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
          >
            <CloseIcon />
          </button>

          <img
            src={
              gallery[lightbox].image
            }
            alt={
              gallery[lightbox].title
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          />

          <strong>
            {gallery[lightbox].title}
          </strong>
        </div>
      )}
    </main>
  );
}
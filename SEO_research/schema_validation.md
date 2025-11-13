# Schema.org Validation Log

_Last updated: 12.11.2025_

## Как перепроверить разметку
- Запусти dev-сервер: `npm run dev`.
- Забери HTML: `curl -s http://localhost:3000/samara/catalog`.
- Сразу распарсь JSON-LD в файлы: `curl -s http://localhost:3000/samara/catalog | PREFIX=samara-catalog python3 /tmp/extract_schema.py` (скрипт складывает данные в `/tmp/schema-tests/`).
- Прокати оффлайн-проверку: `npx structured-data-testing-tool --file /tmp/schema-tests/samara-catalog-1.json`.
- Для продакшн-проверки открой [валидатор Яндекса](https://webmaster.yandex.ru/tools/microtest/), вставь содержимое `<script type="application/ld+json">…</script>` и запусти тест.

## Сводная таблица проверок (CLI, 12.11.2025)

### Базовые страницы
| Страница | URL | Типы Schema.org | Статус CLI | Что делать дальше |
| --- | --- | --- | --- | --- |
| Главная | `/` | `WebSite`, `Organization`, `BreadcrumbList` | Pass (100%) | — |
| Конструкция | `/construction` | `CollectionPage`, `ItemList` | Pass (100%) | — |
| FAQ | `/faq` | `FAQPage` | Pass (100%) | — |
| Контакты | `/contacts` | `ContactPage`, `LocalBusiness` | Pass (100%) | — |
| Общая доставка | `/delivery` | `Service`, `BreadcrumbList` | Pass (100%) | — |

### Региональные страницы
| Страница | URL | Типы Schema.org | Статус CLI | Что делать дальше |
| --- | --- | --- | --- | --- |
| Самара (регион) | `/samara` | `LocalBusiness`, `BreadcrumbList` | Pass (100%) | — |
| Самара каталог | `/samara/catalog` | `CollectionPage`, `BreadcrumbList` | Pass (100%) | — |
| Самара продукт | `/samara/catalog/gazobeton-kottezh-d400-300mm` | `Product`, `BreadcrumbList`, `FAQPage` | Pass (100%) | — |
| Самара доставка | `/samara/delivery` | `Service`, `BreadcrumbList` | Pass (100%) | — |
| Москва (регион) | `/moscow` | `LocalBusiness`, `BreadcrumbList` | Pass (100%) | — |
| Москва каталог | `/moscow/catalog` | `CollectionPage`, `BreadcrumbList` | Pass (100%) | — |
| Москва продукт | `/moscow/catalog/gazobeton-bonolit-d500-300mm` | `Product`, `BreadcrumbList`, `FAQPage` | Pass (100%) | — |
| Москва доставка | `/moscow/delivery` | `Service`, `BreadcrumbList` | Pass (100%) | — |
| Санкт-Петербург (регион) | `/spb` | `LocalBusiness`, `BreadcrumbList` | Pass (100%) | — |
| СПб каталог | `/spb/catalog` | `CollectionPage`, `BreadcrumbList` | Pass (100%) | — |
| СПб продукт | `/spb/catalog/gazobeton-lsr-d500-300mm` | `Product`, `BreadcrumbList`, `FAQPage` | Pass (100%) | — |
| СПб доставка | `/spb/delivery` | `Service`, `BreadcrumbList` | Pass (100%) | — |
| Уфа (регион) | `/ufa` | `LocalBusiness`, `BreadcrumbList` | Pass (100%) | — |
| Уфа каталог | `/ufa/catalog` | `CollectionPage`, `BreadcrumbList` | Pass (100%) | — |
| Уфа продукт | `/ufa/catalog/gazobeton-novoblock-d500-300mm` | `Product`, `BreadcrumbList`, `FAQPage` | Pass (100%) | — |
| Уфа доставка | `/ufa/delivery` | `Service`, `BreadcrumbList` | Pass (100%) | — |

### Новые страницы (12.11.2025)

#### Страницы производителей
| Страница | URL | Типы Schema.org | Статус CLI | Что делать дальше |
| --- | --- | --- | --- | --- |
| Bonolit Москва | `/moscow/manufacturer/bonolit` | `Brand`, `Product` (до 10), `BreadcrumbList` | ✅ Добавлено | Проверить через валидатор |
| Bonolit СПб | `/spb/manufacturer/bonolit` | `Brand`, `Product` (до 10), `BreadcrumbList` | ✅ Добавлено | Проверить через валидатор |
| Коттедж Самара | `/samara/manufacturer/kottezh` | `Brand`, `Product` (до 10), `BreadcrumbList` | ✅ Добавлено | Проверить через валидатор |
| LSR СПб | `/spb/manufacturer/lsr` | `Brand`, `Product` (до 10), `BreadcrumbList` | ✅ Добавлено | Проверить через валидатор |
| Poritep Москва | `/moscow/manufacturer/poritep` | `Brand`, `Product` (до 10), `BreadcrumbList` | ✅ Добавлено | Проверить через валидатор |
| Istkult Москва | `/moscow/manufacturer/istkult-ytong` | `Brand`, `Product` (до 10), `BreadcrumbList` | ✅ Добавлено | Проверить через валидатор |

**Примечание:** Schema.org разметка перенесена из клиентского компонента (useEffect) в серверный компонент для лучшей SEO-оптимизации.

#### Статьи в разделе /construction
| Страница | URL | Типы Schema.org | Статус CLI | Что делать дальше |
| --- | --- | --- | --- | --- |
| Как выбрать газобетон | `/construction/vybor-gazobetona` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Газобетон в сравнении | `/construction/gazobeton-v-sravnenii` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Кладка газобетона | `/construction/kladka-gazobetona` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Утепление газобетона | `/construction/uteplenie-gazobetona` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Фундамент под газобетон | `/construction/fundament-dlja-gazobetona` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Калькулятор газобетона | `/construction/kalkulyator-gazobetona` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Проект дома 10x10 | `/construction/proekt-doma-10x10` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Баня из газоблока | `/construction/banja-iz-gazobloka` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Хозпостройки | `/construction/hozpostrojki-iz-gazobetona` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Армирование | `/construction/armirovanie-i-peremychki` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Доставка и хранение | `/construction/dostavka-i-hranenije` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Хранение и зима | `/construction/hranenie-i-zima` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Инструменты | `/construction/instrumenty-dlja-gazobetona` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Монтаж Bonolit | `/construction/montazh-bonolit` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Самовывоз и манипулятор | `/construction/samovyvoz-i-manipulyator` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Сколько блоков надо | `/construction/skolko-blokov-nado` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Утепление или нет | `/construction/uteplenie-ili-net` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |
| Защита от влаги | `/construction/zashita-ot-vlagi` | `Article`, `BreadcrumbList`, `FAQPage` | ✅ Добавлено | Проверить через валидатор |

**Всего статей:** 18

## Рекомендации
- **CLI/Яндекс-проверка:** прогнать обновлённые страницы через `structured-data-testing-tool` и валидатор Яндекса (страницы производителей, все статьи `/construction`).
- **OfferCatalog по регионам:** при необходимости расширить список тарифов (`hasOfferCatalog`) конкретными `Offer` с актуальными ценами и усложнёнными маршрутами.
- **Регулярная синхронизация:** при изменении контента региональных страниц обновлять JSON-LD и отмечать результаты в таблице (дата, статус, замечания) + `TASKS.md`.
- **Поддержка связности:** следить, чтобы новые статьи/FAQ автоматически синхронизировались с FAQPage/CollectionPage схемами.
- **Brand schema:** на страницах производителей добавлена разметка `Brand` с описанием и ссылкой на официальный сайт (если есть).
- **Product schema:** на страницах производителей добавлена разметка `Product` для первых 10 товаров с полными характеристиками и ценами.

## Изменения 12.11.2025
- ✅ Перенесена Schema.org разметка со страниц производителей из клиентского компонента (useEffect) в серверный компонент для лучшей SEO-оптимизации
- ✅ Добавлена разметка `Brand` на всех страницах производителей
- ✅ Добавлена разметка `Product` для товаров на страницах производителей (первые 10)
- ✅ Все 18 статей в `/construction` имеют разметку `Article` с полными метаданными
- ✅ Все страницы имеют `BreadcrumbList` для навигации

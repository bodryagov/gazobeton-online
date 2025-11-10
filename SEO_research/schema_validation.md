# Schema.org Validation Log

_Last updated: 10.11.2025_

## Как перепроверить разметку
- Запусти dev-сервер: `npm run dev`.
- Забери HTML: `curl -s http://localhost:3000/samara/catalog`.
- Сразу распарсь JSON-LD в файлы: `curl -s http://localhost:3000/samara/catalog | PREFIX=samara-catalog python3 /tmp/extract_schema.py` (скрипт складывает данные в `/tmp/schema-tests/`).
- Прокати оффлайн-проверку: `npx structured-data-testing-tool --file /tmp/schema-tests/samara-catalog-1.json`.
- Для продакшн-проверки открой [валидатор Яндекса](https://webmaster.yandex.ru/tools/microtest/), вставь содержимое `<script type="application/ld+json">…</script>` и запусти тест.

## Сводная таблица проверок (CLI, 10.11.2025)
| Страница | URL | Типы Schema.org | Статус CLI | Что делать дальше |
| --- | --- | --- | --- | --- |
| Главная | `/` | `WebSite`, `Organization`, `BreadcrumbList` | Pass (100%) | — |
| Конструкция | `/construction` | `CollectionPage`, `ItemList` | Pass (100%) | — |
| FAQ | `/faq` | `FAQPage` | Pass (100%) | — |
| Контакты | `/contacts` | `ContactPage`, `LocalBusiness` | Pass (100%) | — |
| Общая доставка | `/delivery` | `Service`, `BreadcrumbList` | Pass (100%) | — |
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

## Рекомендации
- **CLI/Яндекс-проверка:** прогнать обновлённые страницы через `structured-data-testing-tool` и валидатор Яндекса (главная, `/construction`, `/faq`, `/contacts`, `/delivery`, все региональные `/delivery`).
- **OfferCatalog по регионам:** при необходимости расширить список тарифов (`hasOfferCatalog`) конкретными `Offer` с актуальными ценами и усложнёнными маршрутами.
- **Регулярная синхронизация:** при изменении контента региональных страниц обновлять JSON-LD и отмечать результаты в таблице (дата, статус, замечания) + `TASKS.md`.
- **Поддержка связности:** следить, чтобы новые статьи/FAQ автоматически синхронизировались с FAQPage/CollectionPage схемами.



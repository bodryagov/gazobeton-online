# Логотипы производителей

Эта папка содержит логотипы производителей газобетона.

## Требования к логотипам

- **Формат:** SVG (предпочтительно) или PNG
- **Размер:** ~200x80px
- **Названия файлов:**
  - `ytong.svg` или `ytong.png`
  - `bonolit.svg` или `bonolit.png`
  - `kottedzh.svg` или `kottedzh.png`
  - `gras.svg` или `gras.png`
  - `teplon.svg` или `teplon.png`
  - `teplit.svg` или `teplit.png`

## Использование

После добавления логотипов обновите компонент в `app/page.tsx`, раскомментировав строку с `<img>` в блоке производителей.

```tsx
<img 
  src={`/brands/${brand.slug}.svg`} 
  alt={`Логотип ${brand.name}`} 
  className="max-w-full max-h-full object-contain" 
/>
```


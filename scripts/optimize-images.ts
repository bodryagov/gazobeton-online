import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

interface OptimizeOptions {
  inputDir: string;
  outputDir: string;
  watermarkText: string;
  maxWidth: number;
  quality: number;
}

const OPTIONS: OptimizeOptions = {
  inputDir: path.join(process.cwd(), 'Images_blocks'),
  outputDir: path.join(process.cwd(), 'public/products'),
  watermarkText: 'Gazobeton Online',
  maxWidth: 1200,
  quality: 80,
};

const BRAND_DIR_MAP: Record<string, string> = {
  Bonolit: 'bonolit',
  Cottage: 'kottezh',
  GRAS: 'gras',
  Istkult: 'istkult-ytong',
  LSR: 'lsr',
  Novoblock: 'novoblock',
  Poritep: 'poritep',
  Stenblock: 'stenblock',
  Teplon: 'teplon',
};

type ImageVariant = 'stenovoi' | 'peregorodka';

function getVariantName(fileName: string): ImageVariant | null {
  if (fileName.includes('stenovoi')) return 'stenovoi';
  if (fileName.includes('peregorodka')) return 'peregorodka';
  return null;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function createWatermark(width: number, height: number, text: string) {
  const fontSize = Math.round(Math.max(width, height) * 0.042);
  const padding = Math.round(Math.max(width, height) * 0.02);

  return Buffer.from(
    `<svg width="${width}" height="${height}">
      <style>
        .watermark { fill: rgba(120, 120, 120, 0.75); font-family: 'Arial', sans-serif; font-size: ${fontSize}px; font-weight: 600; letter-spacing: 1px; }
      </style>
      <text x="${width - padding}" y="${height - padding}" text-anchor="end" class="watermark">${text}</text>
    </svg>`
  );
}

async function processImage(brand: string, fileName: string) {
  const brandKey = BRAND_DIR_MAP[brand];
  if (!brandKey) {
    console.warn(`⚠️  Неизвестный бренд: ${brand}`);
    return;
  }

  const variant = getVariantName(fileName);
  if (!variant) {
    console.warn(`⚠️  Пропускаю файл без варианта: ${fileName}`);
    return;
  }

  const outputDir = path.join(OPTIONS.outputDir, brandKey);
  await ensureDir(outputDir);

  const inputPath = path.join(OPTIONS.inputDir, brand, fileName);
  const baseImage = sharp(inputPath).rotate();

  const metadata = await baseImage.metadata();
  const width = metadata.width ?? OPTIONS.maxWidth;
  const height = metadata.height ?? OPTIONS.maxWidth;

  const resizeWidth = width > OPTIONS.maxWidth ? OPTIONS.maxWidth : width;
  const resizeHeight = Math.round((height / width) * resizeWidth);

  const watermark = createWatermark(resizeWidth, resizeHeight, OPTIONS.watermarkText);

  const pipeline = baseImage
    .resize({ width: resizeWidth })
    .flatten({ background: '#ffffff' })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${resizeWidth}" height="${resizeHeight}">
            <rect width="100%" height="100%" fill="#ffffff"/>
          </svg>`
        ),
        blend: 'dest-in',
      },
      {
        input: watermark,
        gravity: 'southeast',
      },
    ])
    .modulate({ saturation: 1.05, brightness: 1 })
    .sharpen();

  const jpegOutput = path.join(outputDir, variant === 'stenovoi' ? 'wall.jpg' : 'partition.jpg');
  const webpOutput = jpegOutput.replace('.jpg', '.webp');

  await pipeline.clone().jpeg({ quality: OPTIONS.quality }).toFile(jpegOutput);
  await pipeline.clone().webp({ quality: OPTIONS.quality }).toFile(webpOutput);

  console.log(`✅ ${brand}/${fileName} → ${path.relative(process.cwd(), jpegOutput)} + WebP`);
}

async function run() {
  const brands = await fs.readdir(OPTIONS.inputDir, { withFileTypes: true });

  for (const brand of brands) {
    if (!brand.isDirectory()) continue;

    const files = await fs.readdir(path.join(OPTIONS.inputDir, brand.name));
    for (const file of files) {
      if (!file.match(/\.(png|jpe?g)$/i)) continue;
      await processImage(brand.name, file);
    }
  }
}

run()
  .then(() => {
    console.log('🎉 Оптимизация завершена.');
  })
  .catch((error) => {
    console.error('❌ Ошибка оптимизации:', error);
    process.exit(1);
  });


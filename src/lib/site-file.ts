import { readFile, writeFile } from "fs/promises";
import path from "path";
import type {
  ContentSection,
  ContentSectionKey,
  ServiceItem,
  SiteLinks,
} from "@/types/site";
import { MAX_CONCERN_CARDS, MAX_WHY_CARDS } from "@/types/site";

export const siteFilePath = path.join(process.cwd(), "src", "data", "site.ts");

let siteWriteQueue: Promise<void> = Promise.resolve();

async function withSiteFileLock<T>(task: () => Promise<T>): Promise<T> {
  const previous = siteWriteQueue;
  let release: () => void = () => undefined;
  siteWriteQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous;
  try {
    return await task();
  } finally {
    release();
  }
}

function findMatchingBracket(source: string, bracketStart: number) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = bracketStart; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === '"') inString = false;
      continue;
    }
    if (character === '"') {
      inString = true;
      continue;
    }
    if (character === "[") depth += 1;
    if (character === "]") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function getServiceImagesRange(source: string, serviceId: string) {
  const idToken = `id: "${serviceId}"`;
  const idIndex = source.indexOf(idToken);
  if (idIndex < 0) return null;

  const nextIdIndex = source.indexOf(`id: "`, idIndex + idToken.length);
  const imagesKeyIndex = source.indexOf("images: [", idIndex);
  if (imagesKeyIndex < 0) return null;
  if (nextIdIndex >= 0 && imagesKeyIndex > nextIdIndex) return null;

  const bracketStart = source.indexOf("[", imagesKeyIndex);
  if (bracketStart < 0) return null;
  const bracketEnd = findMatchingBracket(source, bracketStart);
  if (bracketEnd < 0) return null;

  return { bracketStart, bracketEnd };
}

export function getServiceImagesFromSource(
  source: string,
  serviceId: string,
): string[] | null {
  const range = getServiceImagesRange(source, serviceId);
  if (!range) return null;

  try {
    const parsed = JSON.parse(source.slice(range.bracketStart, range.bracketEnd + 1)) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

export function setServiceImagesInSource(
  source: string,
  serviceId: string,
  images: string[],
): string | null {
  const range = getServiceImagesRange(source, serviceId);
  if (!range) return null;

  const formatted =
    images.length === 0
      ? "[]"
      : `[${images.map((imagePath) => `"${imagePath}"`).join(", ")}]`;

  return (
    source.slice(0, range.bracketStart) + formatted + source.slice(range.bracketEnd + 1)
  );
}

export async function updateServiceImages(
  serviceId: string,
  images: string[],
): Promise<boolean> {
  return withSiteFileLock(async () => {
    const current = await readFile(siteFilePath, "utf8");
    const updated = setServiceImagesInSource(current, serviceId, images);
    if (!updated) return false;
    await writeFile(siteFilePath, updated, "utf8");
    return true;
  });
}

export type ServiceTextFields = {
  name: string;
  description: string;
  price: string;
};

function escapeTsString(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, "\\n")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\n");
}

function getServiceBlockRange(source: string, serviceId: string) {
  const idToken = `id: "${serviceId}"`;
  const idIndex = source.indexOf(idToken);
  if (idIndex < 0) return null;

  const nextIdIndex = source.indexOf(`id: "`, idIndex + idToken.length);
  const blockEnd = nextIdIndex >= 0 ? nextIdIndex : source.length;
  return { blockStart: idIndex, blockEnd };
}

function findUnescapedQuote(source: string, start: number, limit: number) {
  for (let index = start; index < limit; index += 1) {
    if (source[index] === "\\") {
      index += 1;
      continue;
    }
    if (source[index] === '"') return index;
  }
  return -1;
}

export function setServiceTextInSource(
  source: string,
  serviceId: string,
  fields: ServiceTextFields,
): string | null {
  const range = getServiceBlockRange(source, serviceId);
  if (!range) return null;

  let next = source;
  const keys: Array<keyof ServiceTextFields> = ["name", "description", "price"];

  for (const key of keys) {
    const block = getServiceBlockRange(next, serviceId);
    if (!block) return null;
    const replaced = replaceQuotedField(
      next,
      block.blockStart,
      block.blockEnd,
      key,
      fields[key],
    );
    if (!replaced) return null;
    next = replaced;
  }

  return next;
}

export async function updateServiceText(
  serviceId: string,
  fields: ServiceTextFields,
): Promise<boolean> {
  return withSiteFileLock(async () => {
    const current = await readFile(siteFilePath, "utf8");
    const updated = setServiceTextInSource(current, serviceId, fields);
    if (!updated) return false;
    await writeFile(siteFilePath, updated, "utf8");
    return true;
  });
}

function getServicesArrayRange(source: string) {
  const keyIndex = source.indexOf("services: [");
  if (keyIndex < 0) return null;
  const bracketStart = source.indexOf("[", keyIndex);
  if (bracketStart < 0) return null;
  const bracketEnd = findMatchingBracket(source, bracketStart);
  if (bracketEnd < 0) return null;
  return { bracketStart, bracketEnd };
}

function parseServiceBlock(block: string): ServiceItem | null {
  const idToken = `id: "`;
  const idKeyIndex = block.indexOf(idToken);
  if (idKeyIndex < 0) return null;
  const idStart = idKeyIndex + idToken.length;
  const idEnd = findUnescapedQuote(block, idStart, block.length);
  if (idEnd < 0) return null;

  const name = parseQuotedField(block, "name");
  const description = parseQuotedField(block, "description");
  const price = parseQuotedField(block, "price");
  if (name === null || description === null || price === null) return null;

  const imagesRangeStart = block.indexOf("images: [");
  if (imagesRangeStart < 0) return null;
  const imagesBracketStart = block.indexOf("[", imagesRangeStart);
  const imagesBracketEnd = findMatchingBracket(block, imagesBracketStart);
  if (imagesBracketEnd < 0) return null;

  let images: string[] = [];
  try {
    const parsed = JSON.parse(
      block.slice(imagesBracketStart, imagesBracketEnd + 1),
    ) as unknown;
    if (!Array.isArray(parsed)) return null;
    images = parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }

  return {
    id: block.slice(idStart, idEnd),
    name,
    description,
    price,
    images,
    visible: !block.includes("visible: false"),
    ...(block.includes("comingSoon: true") ? { comingSoon: true } : {}),
  };
}

function parseQuotedField(block: string, key: string) {
  const prefix = `${key}: "`;
  for (const line of block.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(prefix)) continue;
    if (trimmed.endsWith('",')) {
      return unescapeTsString(trimmed.slice(prefix.length, -2));
    }
    if (trimmed.endsWith('"')) {
      return unescapeTsString(trimmed.slice(prefix.length, -1));
    }
  }
  return null;
}

function replaceQuotedField(
  source: string,
  from: number,
  to: number,
  key: string,
  value: string,
) {
  const slice = source.slice(from, to);
  const lines = slice.split(/(\r?\n)/);
  const prefix = `${key}: "`;
  let replaced = false;
  const nextLines = lines.map((line) => {
    if (replaced || line.startsWith("\r") || line === "\n") return line;
    const leading = line.match(/^\s*/)?.[0] ?? "";
    const trimmed = line.trim();
    if (!trimmed.startsWith(prefix)) return line;
    const comma = trimmed.endsWith('",') || trimmed.endsWith(",");
    replaced = true;
    return `${leading}${prefix}${escapeTsString(value)}"${comma ? "," : ""}`;
  });
  if (!replaced) return null;
  return source.slice(0, from) + nextLines.join("") + source.slice(to);
}

function unescapeTsString(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

export function getServicesFromSource(source: string): ServiceItem[] | null {
  const range = getServicesArrayRange(source);
  if (!range) return null;

  const arrayText = source.slice(range.bracketStart, range.bracketEnd + 1);
  const blocks: string[] = [];
  let depth = 0;
  let blockStart = -1;
  for (let index = 0; index < arrayText.length; index += 1) {
    const character = arrayText[index];
    if (character === "{") {
      if (depth === 0) blockStart = index;
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0 && blockStart >= 0) {
        blocks.push(arrayText.slice(blockStart, index + 1));
        blockStart = -1;
      }
    }
  }

  const services: ServiceItem[] = [];
  for (const block of blocks) {
    const parsed = parseServiceBlock(block);
    if (!parsed) return null;
    services.push(parsed);
  }
  return services;
}

export function formatServicesArray(services: ServiceItem[]) {
  if (services.length === 0) return "[]";

  const items = services.map((service) => {
    const images =
      service.images.length === 0
        ? "[]"
        : `[${service.images.map((imagePath) => `"${imagePath}"`).join(", ")}]`;
    const comingSoon = service.comingSoon ? `,\n      comingSoon: true` : "";

    return `    {
      id: "${escapeTsString(service.id)}",
      name: "${escapeTsString(service.name)}",
      description: "${escapeTsString(service.description)}",
      price: "${escapeTsString(service.price)}",
      images: ${images},
      visible: ${service.visible ? "true" : "false"}${comingSoon}
    }`;
  });

  return `[\n${items.join(",\n")}\n  ]`;
}

export function setServicesInSource(source: string, services: ServiceItem[]) {
  const range = getServicesArrayRange(source);
  if (!range) return null;
  return (
    source.slice(0, range.bracketStart) +
    formatServicesArray(services) +
    source.slice(range.bracketEnd + 1)
  );
}

export async function updateServices(services: ServiceItem[]): Promise<boolean> {
  return withSiteFileLock(async () => {
    const current = await readFile(siteFilePath, "utf8");
    const updated = setServicesInSource(current, services);
    if (!updated) return false;
    await writeFile(siteFilePath, updated, "utf8");
    return true;
  });
}

export async function mutateServices(
  mutator: (services: ServiceItem[]) => ServiceItem[] | null,
): Promise<ServiceItem[] | null> {
  return withSiteFileLock(async () => {
    const current = await readFile(siteFilePath, "utf8");
    const services = getServicesFromSource(current);
    if (!services) return null;
    const next = mutator(services);
    if (!next) return null;
    const updated = setServicesInSource(current, next);
    if (!updated) return null;
    await writeFile(siteFilePath, updated, "utf8");
    return next;
  });
}

export async function readServicesFromSiteFile() {
  const source = await readFile(siteFilePath, "utf8");
  return getServicesFromSource(source);
}

function findMatchingBrace(source: string, braceStart: number) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === "\\") {
        escaped = true;
        continue;
      }
      if (character === '"') inString = false;
      continue;
    }
    if (character === '"') {
      inString = true;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function getLinksRange(source: string) {
  const keyIndex = source.indexOf("links: {");
  if (keyIndex < 0) return null;
  const braceStart = source.indexOf("{", keyIndex);
  if (braceStart < 0) return null;
  const braceEnd = findMatchingBrace(source, braceStart);
  if (braceEnd < 0) return null;
  return { braceStart, braceEnd };
}

export function formatLinksObject(links: SiteLinks) {
  const keys: Array<keyof SiteLinks> = [
    "naverBooking",
    "kakao",
    "instagram",
    "blog",
  ];
  const items = keys.map((key) => {
    const link = links[key];
    return `    ${key}: {
      url: "${escapeTsString(link.url.trim())}",
      enabled: ${link.enabled ? "true" : "false"},
    }`;
  });
  return `{\n${items.join(",\n")}\n  }`;
}

export function setLinksInSource(source: string, links: SiteLinks) {
  const range = getLinksRange(source);
  if (!range) return null;
  return (
    source.slice(0, range.braceStart) +
    formatLinksObject(links) +
    source.slice(range.braceEnd + 1)
  );
}

export async function updateLinks(links: SiteLinks): Promise<boolean> {
  return withSiteFileLock(async () => {
    const current = await readFile(siteFilePath, "utf8");
    const updated = setLinksInSource(current, links);
    if (!updated) return false;
    await writeFile(siteFilePath, updated, "utf8");
    return true;
  });
}

export function getContentSectionRange(source: string, key: ContentSectionKey) {
  const keyIndex = source.indexOf(`${key}: {`);
  if (keyIndex < 0) return null;
  const braceStart = source.indexOf("{", keyIndex);
  if (braceStart < 0) return null;
  const braceEnd = findMatchingBrace(source, braceStart);
  if (braceEnd < 0) return null;
  return { braceStart, braceEnd };
}

export function formatContentSection(section: ContentSection) {
  const cards = section.cards.map(
    (card) => `      {
        id: "${escapeTsString(card.id)}",
        title: "${escapeTsString(card.title)}",
        description: "${escapeTsString(card.description)}",
      }`,
  );
  const cardsText =
    cards.length === 0 ? "[]" : `[\n${cards.join(",\n")}\n    ]`;
  return `{
    title: "${escapeTsString(section.title)}",
    visible: ${section.visible ? "true" : "false"},
    cards: ${cardsText}
  }`;
}

export function setContentSectionInSource(
  source: string,
  key: ContentSectionKey,
  section: ContentSection,
) {
  const range = getContentSectionRange(source, key);
  if (!range) return null;
  return (
    source.slice(0, range.braceStart) +
    formatContentSection(section) +
    source.slice(range.braceEnd + 1)
  );
}

function capSectionCards(key: ContentSectionKey, section: ContentSection) {
  const max = key === "concerns" ? MAX_CONCERN_CARDS : MAX_WHY_CARDS;
  return {
    ...section,
    title: section.title,
    visible: Boolean(section.visible),
    cards: section.cards.slice(0, max).map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,
    })),
  };
}

function getHeroRange(source: string) {
  const keyIndex = source.indexOf("hero: {");
  if (keyIndex < 0) return null;
  const braceStart = source.indexOf("{", keyIndex);
  if (braceStart < 0) return null;
  const braceEnd = findMatchingBrace(source, braceStart);
  if (braceEnd < 0) return null;
  return { braceStart, braceEnd };
}

export function setHeroSubtitleInSource(source: string, subtitle: string) {
  const range = getHeroRange(source);
  if (!range) return null;
  return replaceQuotedField(
    source,
    range.braceStart,
    range.braceEnd + 1,
    "subtitle",
    subtitle,
  );
}

export async function updateHeroSubtitle(subtitle: string): Promise<boolean> {
  return withSiteFileLock(async () => {
    const current = await readFile(siteFilePath, "utf8");
    const updated = setHeroSubtitleInSource(current, subtitle);
    if (!updated) return false;
    await writeFile(siteFilePath, updated, "utf8");
    return true;
  });
}

export async function updateContentSection(
  key: ContentSectionKey,
  section: ContentSection,
): Promise<ContentSection | null> {
  const next = capSectionCards(key, section);
  return withSiteFileLock(async () => {
    const current = await readFile(siteFilePath, "utf8");
    const updated = setContentSectionInSource(current, key, next);
    if (!updated) return null;
    await writeFile(siteFilePath, updated, "utf8");
    return next;
  });
}

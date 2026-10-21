import { PrismaClient } from '@prisma/client';

const linkId = Number(process.argv[2]);
const count = Number(process.argv[3]);

const MAX_COUNT = 5_000_000;
const THIRTY_DAYS_MS = 30 * (24 * 60 * 60 * 1000);
const BATCH_SIZE = 5000

const prisma = new PrismaClient();

if (
  !Number.isInteger(linkId) ||
  linkId <= 0 ||
  !Number.isInteger(count) ||
  count <= 0 ||
  count > MAX_COUNT
) {
  console.error(`Usage: seed-clicks <linkId> <count>`);
  console.error(
    `Note: Both must be integers > 0. Max count is ${MAX_COUNT.toLocaleString()}.`,
  );
  process.exit(1);
}

console.log(`Seeding ${count} clicks for link ${linkId}`);

const profiles = [
  {
    browser: 'Chrome',
    os: 'Windows',
    device: 'desktop',
  },
  {
    browser: 'Mobile Safari',
    os: 'iOS',
    device: 'mobile',
  },
  {
    browser: 'Firefox',
    os: 'Linux',
    device: 'desktop',
  },
];

const referrers = ['https://google.com', 'https://twitter.com', null, null];

function randomItem<T>(list: T[]): T {
  const randomIndex: number = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function randomDate() {
  const date = Date.now();
  const randomDuration = Math.random() * THIRTY_DAYS_MS;
  const randomTimestamp = date - randomDuration;
  return new Date(randomTimestamp);
}

function makeClick(linkId: number) {
  const profile = randomItem(profiles);
  const referrer = randomItem(referrers);
  const date = randomDate();
  return {
    linkId: linkId,
    browser: profile.browser,
    os: profile.os,
    device: profile.device,
    referrer: referrer,
    createdAt: date,
  };
}

async function main() {
  try {
    const link = await prisma.link.findUnique({
      where: {
        id: linkId,
      },
    });
    if (!link) {
      console.error(`link ${linkId} not found`);
      process.exitCode = 1;
      return;
    }
    const profile = randomItem(profiles);
    const referrer = randomItem(referrers);
    const click = await prisma.click.create({
      data: {
        linkId: link.id,
        browser: profile.browser,
        os: profile.os,
        device: profile.device,
        referrer: referrer,
        createdAt: randomDate(),
      },
    });
    console.log(
      `click id - ${click.id} click creation date - ${click.createdAt}`,
    );
    return click;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

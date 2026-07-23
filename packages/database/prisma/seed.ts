/**
 * MATHO — database seed script (Phase 1 placeholder).
 * Seeds only reference data (languages) — no demo business data yet.
 */
import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.language.createMany({
    data: [
      { code: 'en', name: 'English', isDefault: true },
      { code: 'ko', name: '한국어', isDefault: false },
      { code: 'zh', name: '中文', isDefault: false },
      { code: 'es', name: 'Español', isDefault: false },
      { code: 'id', name: 'Bahasa Indonesia', isDefault: false },
    ],
    skipDuplicates: true,
  });
  console.info('[matho] seed complete: languages');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

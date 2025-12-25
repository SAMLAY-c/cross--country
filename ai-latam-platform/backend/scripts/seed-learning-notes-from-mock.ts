/**
 * Seed learning_notes with frontend mock data.
 * Run from backend directory with: npx tsx scripts/seed-learning-notes-from-mock.ts
 */

import { DUMMY_LEARNING_NOTES } from '../../src/lib/mock-data';

type LearningNotePayload = {
  title: string;
  slug: string;
  category: string;
  summary?: string | null;
  tags: string[];
  cover_image?: string | null;
  content: string;
  order_index?: number | null;
};

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';

async function seed() {
  console.log('🌱 Seeding learning_notes from frontend mock data...');
  console.log(`🔗 API base: ${API_BASE}`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const [index, note] of DUMMY_LEARNING_NOTES.entries()) {
    const payload: LearningNotePayload = {
      title: note.title,
      slug: note.slug,
      category: note.category,
      summary: note.summary,
      tags: note.tags,
      cover_image: note.coverImage ?? null,
      content: note.content,
      order_index: index,
    };

    try {
      const response = await fetch(`${API_BASE}/api/learning-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        console.log(`↷ Skip (exists): ${note.slug}`);
        skipped += 1;
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        console.error(`✗ Failed: ${note.slug} (${response.status}) ${text}`);
        failed += 1;
        continue;
      }

      console.log(`✓ Created: ${note.slug}`);
      created += 1;
    } catch (error) {
      console.error(`✗ Error: ${note.slug}`, error);
      failed += 1;
    }
  }

  console.log('\nDone.');
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

seed();

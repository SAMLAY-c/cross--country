/**
 * Test creating a learning note with Prisma
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCreate() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    console.log('Testing create learning note...');

    const note = await prisma.learningNote.create({
      data: {
        title: 'Prisma Test ' + Date.now(),
        slug: 'prisma-test-' + Date.now(),
        category: 'Test',
        tags: ['test', 'prisma'],
        content: '# Test\n\nThis is a test.'
      }
    });

    console.log('✅ Created note:', note.id);
    console.log('   Title:', note.title);
    console.log('   Tags:', note.tags);

    await prisma.learningNote.delete({
      where: { id: note.id }
    });
    console.log('✅ Cleaned up test note');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.meta) {
      console.error('   Meta:', JSON.stringify(error.meta, null, 2));
    }
  } finally {
    await prisma.$disconnect();
  }
}

testCreate();

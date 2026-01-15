import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log('Available Prisma models:')
console.log(Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')))

// Check if fieldConfig exists
const anyPrisma = prisma as any
console.log('\nfieldConfig exists:', 'fieldConfig' in prisma)
console.log('Type of fieldConfig:', typeof anyPrisma.fieldConfig)

import { db } from '@/db';
import { systemState } from '@/db/schema';

async function main() {
    const sampleSystemState = [
        {
            id: 1,
            votingEnabled: true,
            emergencyLockdown: false,
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(systemState).values(sampleSystemState);
    
    console.log('✅ System state seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
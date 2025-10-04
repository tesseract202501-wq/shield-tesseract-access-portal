import { db } from '@/db';
import { adminActivity } from '@/db/schema';

async function main() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const sampleAdminActivity = [
        {
            action: 'Admin login',
            details: 'Administrator login from IP: 192.168.1.45',
            timestamp: new Date(last24Hours.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Voting activated',
            details: 'System-wide voting enabled by admin',
            timestamp: new Date(last24Hours.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Project unlocked',
            details: 'Unlocked project: EcoTracker Mobile App',
            timestamp: new Date(last24Hours.getTime() + 5 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Project unlocked',
            details: 'Unlocked project: Smart Home Dashboard',
            timestamp: new Date(last24Hours.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Database backup created',
            details: 'Created automated database backup',
            timestamp: new Date(last24Hours.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Security scan completed',
            details: 'Completed security vulnerability scan',
            timestamp: new Date(last24Hours.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Emergency lockdown enabled',
            details: 'Emergency lockdown activated due to suspicious activity',
            timestamp: new Date(last24Hours.getTime() + 14 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Vote count adjusted',
            details: 'Manual vote count adjustment for project: AI-Powered Chatbot',
            timestamp: new Date(last24Hours.getTime() + 15 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'Emergency lockdown disabled',
            details: 'Emergency lockdown lifted, normal operations resumed',
            timestamp: new Date(last24Hours.getTime() + 16 * 60 * 60 * 1000).toISOString(),
        },
        {
            action: 'System maintenance',
            details: 'Performed routine system maintenance and updates',
            timestamp: new Date(last24Hours.getTime() + 22 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(adminActivity).values(sampleAdminActivity);
    
    console.log('✅ Admin activity seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
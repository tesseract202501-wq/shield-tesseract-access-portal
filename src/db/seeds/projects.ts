import { db } from '@/db';
import { projects } from '@/db/schema';

async function main() {
    const sampleProjects = [
        {
            teamName: 'STARK INDUSTRIES',
            description: 'Advanced AI-powered defense systems and clean energy solutions',
            demoUrl: 'https://stark-industries-demo.netlify.app',
            voteCount: 185,
            isLocked: false,
            createdAt: new Date('2024-12-16T09:30:00Z').toISOString(),
            updatedAt: new Date('2024-12-16T09:30:00Z').toISOString(),
        },
        {
            teamName: 'ASGARD TECH',
            description: 'Mystical technology bridging ancient wisdom with modern innovation',
            demoUrl: 'https://asgard-tech-showcase.vercel.app',
            voteCount: 142,
            isLocked: true,
            createdAt: new Date('2024-12-17T14:15:00Z').toISOString(),
            updatedAt: new Date('2024-12-17T16:45:00Z').toISOString(),
        },
        {
            teamName: 'WAKANDA FOREVER',
            description: 'Vibranium-enhanced sustainable technology for global advancement',
            demoUrl: 'https://wakanda-forever-app.herokuapp.com',
            voteCount: 203,
            isLocked: false,
            createdAt: new Date('2024-12-18T11:20:00Z').toISOString(),
            updatedAt: new Date('2024-12-18T11:20:00Z').toISOString(),
        },
        {
            teamName: 'S.H.I.E.L.D. DEFENSE',
            description: 'Next-generation security protocols and threat detection systems',
            demoUrl: 'https://shield-defense-portal.github.io',
            voteCount: 97,
            isLocked: true,
            createdAt: new Date('2024-12-19T08:45:00Z').toISOString(),
            updatedAt: new Date('2024-12-19T13:30:00Z').toISOString(),
        },
        {
            teamName: 'X-MEN ACADEMY',
            description: 'Educational platform for gifted individuals and mutation research',
            demoUrl: 'https://xavier-academy.netlify.app',
            voteCount: 156,
            isLocked: false,
            createdAt: new Date('2024-12-20T16:00:00Z').toISOString(),
            updatedAt: new Date('2024-12-20T16:00:00Z').toISOString(),
        },
        {
            teamName: 'AVENGERS INITIATIVE',
            description: 'Collaborative hero management and global crisis response system',
            demoUrl: 'https://avengers-initiative.surge.sh',
            voteCount: 174,
            isLocked: false,
            createdAt: new Date('2024-12-21T12:30:00Z').toISOString(),
            updatedAt: new Date('2024-12-21T12:30:00Z').toISOString(),
        }
    ];

    await db.insert(projects).values(sampleProjects);
    
    console.log('✅ Projects seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
import Airtable from 'airtable';
import type { AirtableTeamMember, TeamMember } from '../types/content.js';

// Airtable configuration interface
interface AirtableConfig {
  apiToken: string;
  baseId: string;
  tableName: string;
}

// Get Airtable configuration from environment variables
function getAirtableConfig(): AirtableConfig {
  const apiToken = import.meta.env.AIRTABLE_API_TOKEN;
  const baseId = import.meta.env.AIRTABLE_BASE_ID;
  const tableName = import.meta.env.AIRTABLE_TABLE_NAME || 'Team';

  if (!apiToken) {
    throw new Error('AIRTABLE_API_TOKEN environment variable is required');
  }

  if (!baseId) {
    throw new Error('AIRTABLE_BASE_ID environment variable is required');
  }

  return {
    apiToken,
    baseId,
    tableName,
  };
}

// Transform raw Airtable data to TeamMember format
function transformAirtableRecord(record: any): TeamMember {
  const fields = record.fields;

  // Get the first photo if available
  const photo =
    fields.Photo && fields.Photo.length > 0 ? fields.Photo[0] : null;
  const imageUrl = photo?.thumbnails?.large?.url || photo?.url || '';

  const result = {
    id: record.id,
    name: fields.Name || '',
    bio: fields.Bio || '',
    image: imageUrl,
    imageAlt: fields.Name || '',
    social: {
      homepage: fields['Homepage URL'] || undefined,
      twitter: fields['Twitter username'] || undefined,
      github: fields['GitHub username'] || undefined,
      instagram: fields['Instagram username'] || undefined,
      youtube: fields['YouTube URL'] || undefined,
    },
  };

  return result;
}

// Fetch team members from Airtable
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const config = getAirtableConfig();

    // Configure Airtable
    Airtable.configure({
      apiKey: config.apiToken,
    });

    const base = Airtable.base(config.baseId);
    const table = base(config.tableName);

    // Fetch records with sorting by Order field
    const records = await table
      .select({
        sort: [{ field: 'Order', direction: 'asc' }],
      })
      .all();

    // Transform records to TeamMember format
    const teamMembers = records.map(transformAirtableRecord);

    console.log(
      `Successfully fetched ${teamMembers.length} team members from Airtable`
    );
    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members from Airtable:', error);

    // Return empty array as fallback
    return [];
  }
}

// Fetch team members with error handling and fallback
export async function fetchTeamMembersWithFallback(): Promise<TeamMember[]> {
  const teamMembers = await fetchTeamMembers();

  console.log(`Fetched ${teamMembers.length} team members from Airtable`);

  // If no team members were fetched (empty array), return fallback data
  if (teamMembers.length === 0) {
    console.warn('No team members found, using fallback data');

    return [
      {
        id: 'pitang1965',
        name: 'ピータン',
        bio: 'Webアプリの個人開発ができるようになるための2019年1月からの学習を、React等を2022年1月からWeb開発を継続しています。趣味はランニングとシミュレータで運転活動。<br>中国語。',
        image: '/images/team/pitang.jpg',
        imageAlt: 'ピータンのプロフィール写真',
        social: {
          twitter: 'pitang1965',
          github: 'pitang1965',
          homepage: 'https://pitang1965.com',
          instagram: 'pitang1965',
        },
      },
      {
        id: 'son',
        name: 'そんほんす',
        bio: '2023年3月頃から主婦。コーディングとかWebサイト制作の個人事業主です。',
        image: '/images/team/son.jpg',
        imageAlt: 'そんほんすのプロフィール写真',
        social: {
          twitter: 'horumont',
          github: 'horumont',
        },
      },
      {
        id: 'nagataku',
        name: 'ながたく',
        bio: 'JavaScript サイトをしっかり作る機能を身につけたくて参加させていただいています。楽しく学ばせていただいています。よろしくお願いします。',
        image: '/images/team/torikai.jpg',
        imageAlt: 'ながたくのプロフィール写真',
        social: {
          twitter: '_return_null_',
          github: 'takunagai',
        },
      },
      {
        id: 'maki-daisuke',
        name: 'まき だいすけ',
        bio: 'フルスタック開発者として活動。<br>コミュニティの技術向上に貢献しています。',
        image: '/images/team/maki-daisuke.jpg',
        imageAlt: 'まき だいすけのプロフィール写真',
        social: {
          twitter: 'maki_daisuke',
          github: 'maki-daisuke',
        },
      },
      {
        id: 'shinnosuke',
        name: 'しんのすけ',
        bio: 'Web技術の探求と実践を続けています。<br>新しい挑戦を楽しんでいます。',
        image: '/images/team/shinnosuke.jpg',
        imageAlt: 'しんのすけのプロフィール写真',
        social: {
          twitter: 'shinnosuke_web',
          github: 'shinnosuke',
        },
      },
      {
        id: 'yasuji-nakanishi',
        name: '中西 やすじ',
        bio: 'デザインとフロントエンド開発を担当。<br>ユーザー体験の向上を重視しています。',
        image: '/images/team/yasuji-nakanishi.jpg',
        imageAlt: '中西 やすじのプロフィール写真',
        social: {
          twitter: 'yasuji_nakanishi',
          github: 'yasuji-nakanishi',
        },
      },
      {
        id: 'bat',
        name: 'ばっと',
        bio: 'Web開発の学習を続けています。<br>コミュニティでの交流を大切にしています。',
        image: '/images/team/bat.jpg',
        imageAlt: 'ばっとのプロフィール写真',
        social: {
          twitter: 'bat_web',
          github: 'bat',
        },
      },
      {
        id: 'damgo',
        name: 'だむご',
        bio: 'フロントエンド技術に興味があります。<br>日々学習を重ねています。',
        image: '/images/team/damgo.jpg',
        imageAlt: 'だむごのプロフィール写真',
        social: {
          twitter: 'damgo_dev',
          github: 'damgo',
        },
      },
      {
        id: 'hgnsuika',
        name: 'はぐんすいか',
        bio: 'Web開発の楽しさを追求しています。<br>新しい技術に挑戦中です。',
        image: '/images/team/hgnsuika.jpg',
        imageAlt: 'はぐんすいかのプロフィール写真',
        social: {
          twitter: 'hgnsuika',
          github: 'hgnsuika',
        },
      },
      {
        id: 'kamiking',
        name: 'かみきんぐ',
        bio: 'プログラミングの学習を楽しんでいます。<br>コミュニティ活動に積極的に参加しています。',
        image: '/images/team/kamiking.jpg',
        imageAlt: 'かみきんぐのプロフィール写真',
        social: {
          twitter: 'kamiking_dev',
          github: 'kamiking',
        },
      },
      {
        id: 'kunshi',
        name: 'くんし',
        bio: 'Web技術の習得に励んでいます。<br>チーム開発の経験を積みたいと思っています。',
        image: '/images/team/kunshi.jpg',
        imageAlt: 'くんしのプロフィール写真',
        social: {
          twitter: 'kunshi_web',
          github: 'kunshi',
        },
      },
      {
        id: 'miemo',
        name: 'みえも',
        bio: 'デザインとコーディングの両方に興味があります。<br>ユーザビリティを重視した開発を心がけています。',
        image: '/images/team/miemo.jpg',
        imageAlt: 'みえものプロフィール写真',
        social: {
          twitter: 'miemo_design',
          github: 'miemo',
        },
      },
      {
        id: 'naozo',
        name: 'なおぞー',
        bio: 'バックエンド開発を中心に学習しています。<br>効率的なシステム構築を目指しています。',
        image: '/images/team/naozo.jpg',
        imageAlt: 'なおぞーのプロフィール写真',
        social: {
          twitter: 'naozo_dev',
          github: 'naozo',
        },
      },
      {
        id: 'rumiko',
        name: 'るみこ',
        bio: 'Web開発の基礎から応用まで幅広く学習中です。<br>チームワークを大切にしています。',
        image: '/images/team/rumiko.jpg',
        imageAlt: 'るみこのプロフィール写真',
        social: {
          twitter: 'rumiko_web',
          github: 'rumiko',
        },
      },
      {
        id: 'yoko',
        name: 'よーこ',
        bio: 'フロントエンド開発に情熱を注いでいます。<br>アクセシビリティを重視した開発を心がけています。',
        image: '/images/team/yoko.jpg',
        imageAlt: 'よーこのプロフィール写真',
        social: {
          twitter: 'yoko_frontend',
          github: 'yoko',
        },
      },
    ];
  }

  return teamMembers;
}

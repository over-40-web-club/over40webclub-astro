import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTeamMembersWithFallback } from './airtable.js';

// Mock the Airtable module
vi.mock('airtable', () => ({
  default: {
    configure: vi.fn(),
    base: vi.fn(() => ({
      select: vi.fn(() => ({
        all: vi.fn(() => Promise.resolve([])), // Return empty array by default
      })),
    })),
  },
}));

describe('Airtable utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    vi.stubEnv('AIRTABLE_API_TOKEN', 'test-token');
    vi.stubEnv('AIRTABLE_BASE_ID', 'test-base');
    vi.stubEnv('AIRTABLE_TABLE_NAME', 'Team');
  });

  it('should return fallback data when no team members are found', async () => {
    const result = await fetchTeamMembersWithFallback();

    expect(result).toHaveLength(15); // Fallback data has 15 members
    expect(result[0]).toMatchObject({
      id: 'pitang1965',
      name: 'ピータン',
    });
  });

  it('should handle missing environment variables gracefully', async () => {
    vi.stubEnv('AIRTABLE_API_TOKEN', '');

    const result = await fetchTeamMembersWithFallback();

    expect(result).toHaveLength(15); // Fallback data has 15 members
    expect(result[0].name).toBe('ピータン');
  });

  it('should return actual data when Airtable returns team members', async () => {
    // Mock successful Airtable response
    const mockTeamData = [
      {
        id: 'rec123',
        fields: {
          Name: 'Test User',
          Bio: 'Test bio',
          Photo: [
            {
              url: 'https://example.com/photo.jpg',
              thumbnails: {
                large: { url: 'https://example.com/large.jpg' },
              },
            },
          ],
          Order: 1,
        },
      },
    ];

    const Airtable = await import('airtable');
    const mockAll = vi.fn(() => Promise.resolve(mockTeamData));
    const mockSelect = vi.fn(() => ({ all: mockAll }));
    const mockTable = vi.fn(() => ({ select: mockSelect }));
    Airtable.default.base = vi.fn(() => mockTable);

    const result = await fetchTeamMembersWithFallback();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'rec123',
      name: 'Test User',
      bio: 'Test bio',
      image: 'https://example.com/large.jpg',
    });
  });
});

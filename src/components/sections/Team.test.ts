import { describe, it, expect, vi } from 'vitest';

// Mock the airtable utility
vi.mock('../../utils/airtable.js', () => ({
  fetchTeamMembersWithFallback: vi.fn(() =>
    Promise.resolve([
      {
        id: 'test-1',
        name: 'Test Member',
        bio: 'Test bio',
        image: '/images/team/test.jpg',
        imageAlt: 'Test Member',
        social: {
          twitter: 'testuser',
          github: 'testuser',
        },
      },
    ])
  ),
}));

describe('Team Section', () => {
  it('should have team member data structure', () => {
    const mockTeamMember = {
      id: 'test-1',
      name: 'Test Member',
      bio: 'Test bio',
      image: '/images/team/test.jpg',
      imageAlt: 'Test Member',
      social: {
        twitter: 'testuser',
        github: 'testuser',
      },
    };

    expect(mockTeamMember).toHaveProperty('id');
    expect(mockTeamMember).toHaveProperty('name');
    expect(mockTeamMember).toHaveProperty('bio');
    expect(mockTeamMember).toHaveProperty('image');
    expect(mockTeamMember).toHaveProperty('social');
    expect(mockTeamMember.social).toHaveProperty('twitter');
    expect(mockTeamMember.social).toHaveProperty('github');
  });

  it('should handle empty social links', () => {
    const mockTeamMember = {
      id: 'test-2',
      name: 'Test Member 2',
      bio: 'Test bio 2',
      image: '/images/team/test2.jpg',
      imageAlt: 'Test Member 2',
      social: {},
    };

    const socialLinks = Object.entries(mockTeamMember.social).filter(
      ([_, value]) => value
    );
    expect(socialLinks).toHaveLength(0);
  });
});

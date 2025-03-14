import * as cheerio from 'cheerio';

export function parseCommunityData(jsonData) {
  try {
    // First try to get data from the currentGroup structure (more detailed)
    const currentGroup = jsonData.props?.pageProps?.currentGroup;
    
    // If currentGroup isn't available, fall back to settings structure
    const pageProps = jsonData.props?.pageProps;
    const settings = pageProps?.settings;
    
    // Initialize the base community data object
    const communityData = {};
    
    // Extract data from settings (always present)
    if (settings) {
      communityData.name = settings.pageTitle;
      communityData.meta = {
        description: settings.pageMeta?.description,
        image: settings.pageMeta?.image,
        title: settings.pageMeta?.title,
        touchIcon: settings.pageMeta?.touchIcon
      };
      communityData.mainMenuName = settings.mainMenuName;
      communityData.mainMenuItem = settings.mainMenuItem;
      communityData.previousPageBack = settings.previousPageBack;
      communityData.courseRoute = settings.courseRoute;
    }
    
    // Add pixelId if present
    if (pageProps?.pixelId) {
      communityData.pixelId = pageProps.pixelId;
    }
    
    // Extract the comprehensive data if currentGroup is available
    if (currentGroup) {
      // Basic information
      communityData.id = currentGroup.id;
      communityData.handle = currentGroup.name;
      communityData.displayName = currentGroup.metadata?.displayName;
      communityData.description = currentGroup.metadata?.description;
      
      // Media
      communityData.logo = currentGroup.metadata?.logoUrl;
      communityData.banner = currentGroup.metadata?.coverSmallUrl;
      communityData.favicon = currentGroup.metadata?.faviconUrl;
      communityData.color = currentGroup.metadata?.color;
      communityData.initials = currentGroup.metadata?.initials;
      
      // Stats
      communityData.stats = {
        totalMembers: currentGroup.metadata?.totalMembers,
        totalOnlineMembers: currentGroup.metadata?.totalOnlineMembers,
        totalPosts: currentGroup.metadata?.totalPosts,
        totalAdmins: currentGroup.metadata?.totalAdmins,
        totalRules: currentGroup.metadata?.totalRules
      };
      
      // Include essential settings directly rather than in features object
      communityData.calendarEnabled = currentGroup.metadata?.calendarEnabled === 1;
      communityData.membership = currentGroup.metadata?.membership;
      communityData.privacy = currentGroup.metadata?.privacy;
      communityData.minPostLevel = currentGroup.metadata?.minPostLevel;
      
      // Extract owner information from metadata string if available
      if (currentGroup.metadata?.owner) {
        try {
          const ownerData = JSON.parse(currentGroup.metadata.owner);
          communityData.owner = {
            id: ownerData.id,
            name: ownerData.name,
            firstName: ownerData.first_name,
            lastName: ownerData.last_name,
            profilePicture: ownerData.metadata?.picture_profile,
            bio: ownerData.metadata?.bio,
            location: ownerData.metadata?.location,
            createdAt: ownerData.created_at,
            updatedAt: ownerData.updated_at
          };
        } catch (error) {
          console.error("Error parsing owner data", error);
        }
      }
      
      // Times
      communityData.createdAt = currentGroup.createdAt;
      communityData.updatedAt = currentGroup.updatedAt;
      
      // Labels/Categories if available
      if (currentGroup.labels && Array.isArray(currentGroup.labels)) {
        communityData.labels = currentGroup.labels.map(label => ({
          id: label.id,
          name: label.metadata?.displayName,
          description: label.metadata?.description,
          color: label.metadata?.color,
          postCount: label.metadata?.posts
        }));
      }
      
      // Online users if available
      if (currentGroup.onlineUsers && Array.isArray(currentGroup.onlineUsers)) {
        communityData.onlineUsers = currentGroup.onlineUsers.map(user => ({
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.metadata?.pictureProfile
        }));
      }
    } else if (pageProps.community) {
      // Fallback to older community structure
      communityData.id = pageProps.community.id;
      communityData.handle = pageProps.community.name;
      communityData.displayName = pageProps.community.metadata?.displayName;
      communityData.description = pageProps.community.metadata?.description;
      communityData.banner = pageProps.community.metadata?.banner;
      communityData.logo = pageProps.community.metadata?.logo;
      communityData.stats = {
        totalMembers: pageProps.community.metadata?.totalMembers,
        totalPosts: pageProps.community.metadata?.totalPosts
      };
      communityData.createdAt = pageProps.community.createdAt;
      communityData.updatedAt = pageProps.community.updatedAt;
      
      if (pageProps.community.owner) {
        communityData.owner = {
          id: pageProps.community.owner.id,
          name: pageProps.community.owner.name,
          profilePicture: pageProps.community.owner.metadata?.pictureProfile
        };
      }
    }
    
    // Additional data from self if available (current user's membership info)
    if (pageProps.self) {
      communityData.currentUser = {
        id: pageProps.self.id,
        name: pageProps.self.name,
        firstName: pageProps.self.firstName,
        lastName: pageProps.self.lastName,
        email: pageProps.self.email,
        profilePicture: pageProps.self.metadata?.pictureProfile,
        bio: pageProps.self.metadata?.bio,
        location: pageProps.self.metadata?.location,
        createdAt: pageProps.self.createdAt,
        updatedAt: pageProps.self.updatedAt
      };
      
      // User's membership in this community
      if (pageProps.self.member) {
        communityData.currentUser.membership = {
          id: pageProps.self.member.id,
          role: pageProps.self.member.role,
          createdAt: pageProps.self.member.createdAt,
          approvedAt: pageProps.self.member.approvedAt
        };
      }
      
      // Other groups the user is a member of
      if (pageProps.self.allGroups && Array.isArray(pageProps.self.allGroups)) {
        communityData.currentUser.allGroups = pageProps.self.allGroups.map(group => ({
          id: group.id,
          name: group.name,
          displayName: group.metadata?.displayName,
          description: group.metadata?.description,
          logo: group.metadata?.logoUrl,
          totalMembers: group.metadata?.totalMembers,
          totalPosts: group.metadata?.totalPosts
        }));
      }
    }
    
    return communityData;
  } catch (error) {
    console.error(`Error parsing community data: ${error.message}`);
    throw error;
  }
}

// Reusing the same extraction function from userDataParser
export function extractJsonFromHtml(htmlContent) {
  try {
    const $ = cheerio.load(htmlContent);
    const scriptTag = $('#__NEXT_DATA__');

    if (scriptTag.length > 0) {
      const jsonText = scriptTag.html();
      return JSON.parse(jsonText);
    }

    throw new Error('__NEXT_DATA__ script tag not found');
  } catch (error) {
    console.error(`Error extracting JSON from HTML: ${error.message}`);
    throw error;
  }
} 
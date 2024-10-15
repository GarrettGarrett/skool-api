import * as cheerio from 'cheerio';


export function parseUserData(jsonData) {

  try {
    
    const currentUser = jsonData.props.pageProps.currentUser;
    const profileData = jsonData.props.pageProps.currentUser.profileData;
    const settings = jsonData.props.pageProps.settings;

    return {
      id: currentUser.id,
      name: currentUser.name,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      bio: currentUser.metadata.bio,
      location: currentUser.metadata.location,
      createdAt: currentUser.createdAt,
      updatedAt: currentUser.updatedAt,
      profilePicture: currentUser.metadata.pictureProfile,
      socialLinks: {
        facebook: currentUser.metadata.linkFacebook,
        instagram: currentUser.metadata.linkInstagram,
        linkedin: currentUser.metadata.linkLinkedin,
        twitter: currentUser.metadata.linkTwitter,
        website: currentUser.metadata.linkWebsite,
        youtube: currentUser.metadata.linkYoutube,
      },
      stats: {
        totalPosts: profileData.totalPosts,
        totalFollowers: profileData.totalFollowers,
        totalFollowing: profileData.totalFollowing,
        totalSharedGroups: profileData.totalSharedGroups,
      },
      groups: {
        memberOf: currentUser.profileData.groupsMemberOf.map(group => ({
          id: group.id,
          name: group.name,
          displayName: group.metadata.displayName,
          description: group.metadata.description,
          totalMembers: group.metadata.totalMembers,
          totalPosts: group.metadata.totalPosts,
        })),
        createdByUser: jsonData.props.pageProps.currentUser.profileData.groupsCreatedByUser.map(group => ({
          id: group.id,
          name: group.name,
          displayName: group.metadata.displayName,
          description: group.metadata.description,
          totalMembers: group.metadata.totalMembers,
          totalPosts: group.metadata.totalPosts,
        })),
      },
      pageTitle: settings.pageTitle,
      pageMeta: settings.pageMeta,
    };
  } catch (error) {
    console.error(`Error parsing user data: ${error.message}`);
    throw error;
  }
}

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




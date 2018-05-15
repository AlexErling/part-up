import { get, each, curryRight, concat } from 'lodash';

const userProfileVisibilityLevels = [
  'partup',   // All users that are registered with Part-up can see profiles of other users;
  'private',  // Only tribe members & partners / supporters of partups;
  'public',   // Everyone;
]

const isViewerConnected = (viewer, user) => {
  let isConnected = false;

  if (!viewer) {
    return isConnected;
  }

  each(get(user, 'networks', []), (networkId) => {
    if (viewer.networks.includes(networkId)) {
      isConnected = true;
      return false;
    }
  });

  if (isConnected) {
    return isConnected;
  } else {
    const curriedGet = curryRight(get);
    const [upperOf, supporterOf] = [curriedGet([])('upperOf'), curriedGet([])('supporterOf')];
    const viewerPartupIds = concat(upperOf(viewer), supporterOf(viewer));
    const userPartupIds = concat(upperOf(user), supporterOf(user));

    each(userPartupIds, (id) => {
      if (viewerPartupIds.includes(id)) {
        isConnected = true;
        return false;
      }
    });
  }
  return isConnected;
}

const authorization = {
  checkCanSeeProfile(viewer, user) {
    const userProfileVisibility = get(user, 'profileVisibility');
    let canSee = false;

    switch (userProfileVisibility) {
      case 'public':
        canSee = true;
        break;
      case 'partup':
        canSee = !!viewer;
        break;
      case 'private':
        canSee = isViewerConnected(viewer, user);
        break;
      default:
        break;
    }

    return canSee;
  }
}

export default authorization;

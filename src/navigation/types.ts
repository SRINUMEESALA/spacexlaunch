import { NAVIGATION_ROUTES } from '../constants/navigation';

export type RootStackParamList = {
  [NAVIGATION_ROUTES.Launches]: undefined;
  [NAVIGATION_ROUTES.LAUNCH_LIST]: undefined;
  [NAVIGATION_ROUTES.LAUNCH_DETAIL]: { launchId: string; launchName: string };
};

export type RootTabParamList = {
  Launches: undefined;
};

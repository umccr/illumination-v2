import React from "react";

import { Route } from "react-router-dom";

import NotificationChannelPage from "../../pages/notificationChannels/NotificationChannelPage";
import NotificationChannelsPage from "../../pages/notificationChannels/NotificationChannelsPage";

const NotificationChannelsRoutes: React.ReactNode[] = [
  <Route
    index
    element={<NotificationChannelsPage />}
    key="notificationChannelRoute"
  />,
  <Route path=":notificationChannelId" key="notificationChannelIdRoute">
    <Route index element={<NotificationChannelPage />} />
  </Route>,
];

export default NotificationChannelsRoutes;

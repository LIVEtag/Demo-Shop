export const createWidgetUrl = ({
  origin,
  project,
  uid,
  isDesktop = true,
  sessionId = null,
}) => `${origin}/${project}?uid=${uid}&sessionId=${sessionId || ''}&isDesktop=${+isDesktop}`;

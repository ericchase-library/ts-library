export function WebPlatform_Utility_Device_Is_Mobile() {
  return /android|iphone|mobile/i.test(window.navigator.userAgent);
}

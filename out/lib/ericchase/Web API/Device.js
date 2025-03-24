export function IsDeviceMobile() {
  return /android|iphone|mobile/i.test(window.navigator.userAgent);
}

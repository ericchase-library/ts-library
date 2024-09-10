export class WebRequestCache {
  static RequestIdToRequestMap = new Map();
  static TabIdToRequestMap = new Map();
  static AddBody(details) {
    const webRequest = this.RequestIdToRequestMap.get(details.requestId);
    if (webRequest) {
      webRequest.bodyDetails = details;
    } else {
      const webRequest = { bodyDetails: details };
      this.RequestIdToRequestMap.set(details.requestId, webRequest);
      this.TabIdToRequestMap.set(details.tabId, webRequest);
    }
  }
  static AddHeaders(details) {
    const webRequest = this.RequestIdToRequestMap.get(details.requestId);
    if (webRequest) {
      webRequest.headersDetails = details;
    } else {
      const webRequest = { headersDetails: details };
      this.RequestIdToRequestMap.set(details.requestId, webRequest);
      this.TabIdToRequestMap.set(details.tabId, webRequest);
    }
    this.Notify();
  }
  static SubscriptionSet = new Set();
  static Subscribe(callback) {
    this.SubscriptionSet.add(callback);
    if (callback()?.abort === true) {
      this.SubscriptionSet.delete(callback);
      return () => {};
    }
    return () => {
      this.SubscriptionSet.delete(callback);
    };
  }
  static Notify() {
    for (const callback of this.SubscriptionSet) {
      if (callback()?.abort === true) {
        this.SubscriptionSet.delete(callback);
      }
    }
  }
}
export async function RebuildAndSendRequest(webRequest) {
  const { bodyDetails, headersDetails } = webRequest;
  const requestUrl = bodyDetails?.url ?? headersDetails?.url;
  if (requestUrl) {
    const requestInit = {};
    if (bodyDetails?.requestBody?.formData) {
      const formData = new FormData();
      for (const [name, values] of Object.entries(bodyDetails.requestBody.formData)) {
        for (const value of values) {
          formData.append(name, value);
        }
      }
      requestInit.body = formData;
    } else if (bodyDetails?.requestBody?.raw) {
      requestInit.body = new Blob(bodyDetails.requestBody.raw.map((_) => _.bytes).filter((_) => _ !== undefined));
    }
    if (headersDetails?.requestHeaders) {
      const headers = new Headers();
      for (const { name, value } of headersDetails.requestHeaders) {
        if (value) {
          headers.append(name, value);
        }
      }
      requestInit.headers = headers;
    }
    return fetch(requestUrl, requestInit);
  }
}
export async function AnalyzeBody(req) {
  const data = {};
  try {
    await req.clone().blob();
    data.blob = true;
  } catch (_) {}
  try {
    await req.clone().formData();
    data.form = true;
  } catch (_) {}
  try {
    await req.clone().json();
    data.json = true;
  } catch (_) {}
  try {
    await req.clone().text();
    data.text = true;
  } catch (_) {}
  return data;
}

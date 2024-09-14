export var WebRequestCache;
((WebRequestCache) => {
  WebRequestCache.RequestIdToRequestMap = new Map();
  WebRequestCache.SubscriptionSet = new Set();
  WebRequestCache.TabIdToRequestMap = new Map();
  function AddBody(details) {
    const webRequest = WebRequestCache.RequestIdToRequestMap.get(details.requestId);
    if (webRequest) {
      webRequest.bodyDetails = details;
    } else {
      const webRequest = { bodyDetails: details };
      WebRequestCache.RequestIdToRequestMap.set(details.requestId, webRequest);
      WebRequestCache.TabIdToRequestMap.set(details.tabId, webRequest);
    }
  }
  WebRequestCache.AddBody = AddBody;
  function AddHeaders(details) {
    const webRequest = WebRequestCache.RequestIdToRequestMap.get(details.requestId);
    if (webRequest) {
      webRequest.headersDetails = details;
    } else {
      const webRequest = { headersDetails: details };
      WebRequestCache.RequestIdToRequestMap.set(details.requestId, webRequest);
      WebRequestCache.TabIdToRequestMap.set(details.tabId, webRequest);
    }
    WebRequestCache.Notify();
  }
  WebRequestCache.AddHeaders = AddHeaders;
  function Notify() {
    for (const callback of WebRequestCache.SubscriptionSet) {
      if (callback()?.abort === true) {
        WebRequestCache.SubscriptionSet.delete(callback);
      }
    }
  }
  WebRequestCache.Notify = Notify;
  function Subscribe(callback) {
    WebRequestCache.SubscriptionSet.add(callback);
    if (callback()?.abort === true) {
      WebRequestCache.SubscriptionSet.delete(callback);
      return () => {};
    }
    return () => {
      WebRequestCache.SubscriptionSet.delete(callback);
    };
  }
  WebRequestCache.Subscribe = Subscribe;
})((WebRequestCache ||= {}));
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

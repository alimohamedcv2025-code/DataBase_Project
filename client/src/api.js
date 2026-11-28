export async function requestApi(path, options) {
  let response;
  try {
    response = await fetch(path, options);
  } catch {
    throw new Error('تعذّر الاتصال بالسيرفر. تأكد إن الـBackend شغّال.');
  }

  if (response.status === 204) return;
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null) {
    throw new Error(data?.error || 'تعذّر إكمال الطلب. تأكد إن الـBackend شغّال ومتصل بقاعدة البيانات.');
  }
  return data;
}

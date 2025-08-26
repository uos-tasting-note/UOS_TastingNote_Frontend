export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response | undefined> {
  const token = localStorage.getItem("access_token");

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    // ✅ 토큰 만료 → 자동 로그아웃
    localStorage.removeItem("access_token");
    window.location.replace("/login");
    return;
  }

  return res;
}

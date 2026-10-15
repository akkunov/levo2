const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(path: string): Promise<T> {
    if (!API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL не задан');
    }

    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
    }

    return response.json() as Promise<T>;
}


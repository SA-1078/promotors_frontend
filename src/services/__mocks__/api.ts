const mockFn = () => Promise.resolve({ data: {} });

export const api = {
    get: mockFn,
    post: mockFn,
    put: mockFn,
    delete: mockFn,
    interceptors: {
        request: { use: () => { } },
        response: { use: () => { } }
    }
};

import createClient from "openapi-fetch";
import type { paths } from "./types";

const api = createClient<paths>({
    baseUrl: "/api",
});

export default api;

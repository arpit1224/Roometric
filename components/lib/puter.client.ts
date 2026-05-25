type PuterClient = typeof import("@heyputer/puter.js").default;

let puterPromise: Promise<PuterClient> | null = null;

export const getPuter = async (): Promise<PuterClient> => {
    if (typeof window === "undefined") {
        throw new Error("Puter is only available in the browser");
    }

    puterPromise ??= import("@heyputer/puter.js").then((module) => module.default);

    return puterPromise;
};

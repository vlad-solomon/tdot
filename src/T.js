import { createTypographyComponent } from "./createTypographyComponent";

const componentCache = new Map();

export const T = new Proxy(
    {},
    {
        get(_, componentName) {
            if (typeof componentName === "symbol") {
                return undefined;
            }

            const name = String(componentName);

            if (componentCache.has(name)) {
                return componentCache.get(name);
            }

            const component = createTypographyComponent(name);

            componentCache.set(name, component);

            return component;
        },
    }
);

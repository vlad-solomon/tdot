import React from "react";
import { useTyppoConfig } from "./provider";
import { twMerge } from "tailwind-merge";

export function createTypographyComponent(componentName) {
    return function TypographyComponent({ children, className = "", ...rest }) {
        const config = useTyppoConfig();
        const entry = config[componentName];

        if (!entry || !entry.tag) {
            console.warn(
                `[Typpo] Skipping "${componentName}": missing required "tag" in config.`
            );
            return null;
        }

        const Tag = entry.tag;
        const classes = entry.classes || "";

        const mergedClassName = twMerge(classes, className);

        return (
            <Tag className={mergedClassName} {...rest}>
                {children}
            </Tag>
        );
    };
}
